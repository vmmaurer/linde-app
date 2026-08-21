/**
 * Otimiza public/images para o totem (painel 1080x1920).
 *
 * Duas ideias, nesta ordem:
 *
 * 1) REDIMENSIONAR. Nenhuma imagem precisa de mais pixels do que a area onde
 *    ela e realmente desenhada. Decodificar um WebP de 24 MP (4000x6000) para
 *    pintar um card de 640x920 custa dezenas de ms de CPU e ~100 MB de RAM por
 *    imagem — e essa conta que travava a troca de tela.
 *
 * 2) RECOMPRIMIR COM QUALIDADE VERIFICADA. Em vez de fixar "quality: 82" e
 *    torcer, cada imagem sobe a qualidade ate o SSIM contra o original passar
 *    do limite (0.985 = diferenca invisivel a olho nu). Assim o arquivo fica
 *    tao pequeno quanto da, mas nunca abaixo do que a vista percebe.
 *
 * Os originais vao para image-originals/ antes de qualquer escrita, e
 * essa pasta e a fonte de verdade nas execucoes seguintes — rodar o script
 * duas vezes nao empilha perda de geracao.
 *
 *   node scripts/optimize-images.mjs --dry   relatorio, nao escreve
 *   node scripts/optimize-images.mjs         aplica
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { ssim } from './lib/ssim.mjs';

const SRC = 'public/images';
const BACKUP = 'image-originals';
const DRY = process.argv.includes('--dry');

// Tamanhos maximos de renderizacao medidos no proprio codigo (px CSS, DPR 1):
//   fundo de tela ......... 1080x1920  (cover, tela cheia)
//   card do ArcCarousel ... 640x920    (ArcCarousel.jsx CARD_W/CARD_H)
//   galeria do modal ...... 896x~1000  (max-w-4xl x 52vh)
//   card da Linha do Tempo  720x420
//   icone da navbar ....... 46x46  ·  logo ~360  ·  QR code ~420
// Os limites abaixo ja embutem folga generosa sobre esses numeros.
const RULES = [
  { name: 'fundo de tela', match: /^(FUNDO-PAGINA-.*|totem)\.webp$/i,             max: [1080, 1920], q0: 80, minSsim: 0.985 },
  // Icones e logos sao arte chapada com alfa: lossless fica pequeno E exato.
  // Os da navbar estao guardados em 1080x1080 para renderizar a 46x46 (!).
  { name: 'logo',          match: /^logonavbar\.webp$/i,                          max: [1024, 1024], lossless: true },
  { name: 'icone',         match: /^(ICON[-_].*|NAV[-_ ].*)\.webp$/i,              max: [256, 256],   lossless: true },
  { name: 'QR code',       match: /qrcode/i,                                      max: [768, 768],   lossless: true },
  { name: 'conteudo',      match: /\.webp$/i,                                     max: [1600, 1600], q0: 80, minSsim: 0.985 },
];

const MB = (n) => (n / 1048576).toFixed(1);
const KB = (n) => Math.round(n / 1024);

async function encode(input, rule) {
  const [maxW, maxH] = rule.max;
  const resize = { width: maxW, height: maxH, fit: 'inside', withoutEnlargement: true, kernel: 'lanczos3' };

  // Arte chapada (icones, logo, QR code): lossless. Zero perda por definicao,
  // e depois do resize o arquivo sai menor que o lossy do original gigante.
  if (rule.lossless) {
    const out = await sharp(input).resize(resize).webp({ lossless: true, effort: 6 }).toBuffer();
    return { out, q: 'lossless', score: 1 };
  }

  // Fotos: escada de qualidade, para na primeira que passa do limite perceptual.
  for (const q of [rule.q0, rule.q0 + 6, rule.q0 + 12, 96]) {
    const out = await sharp(input)
      .resize(resize)
      .webp({ quality: Math.min(q, 100), effort: 6, smartSubsample: true, alphaQuality: 100 })
      .toBuffer();
    const score = await ssim(input, out);
    if (score >= rule.minSsim) return { out, q, score };
    if (q >= 96) return { out, q, score };
  }
}

async function main() {
  await fs.mkdir(BACKUP, { recursive: true });
  const files = (await fs.readdir(SRC)).filter((f) => /\.webp$/i.test(f));

  const rows = [];
  let before = 0;
  let after = 0;

  for (const file of files) {
    const srcPath = path.join(SRC, file);
    const bakPath = path.join(BACKUP, file);

    let input;
    try {
      input = await fs.readFile(bakPath);
    } catch {
      input = await fs.readFile(srcPath);
      if (!DRY) await fs.writeFile(bakPath, input);
    }

    const rule = RULES.find((r) => r.match.test(file));
    const meta = await sharp(input).metadata();
    const { out, q, score } = await encode(input, rule);

    // Nunca troque um arquivo por outro maior: acontece em imagens ja pequenas
    // e bem comprimidas, onde reencodar so piora os dois lados.
    const keep = out.length >= input.length;
    const final = keep ? input : out;
    if (!DRY) await fs.writeFile(srcPath, final);

    const fm = await sharp(final).metadata();
    before += input.length;
    after += final.length;
    rows.push({
      file, rule: rule.name, keep, q, score,
      from: KB(input.length), to: KB(final.length),
      dims: `${meta.width}x${meta.height}`,
      newDims: `${fm.width}x${fm.height}`,
      saved: input.length - final.length,
    });
    process.stdout.write('.');
  }

  rows.sort((a, b) => b.saved - a.saved);
  console.log(`\n\n${DRY ? '[DRY-RUN] ' : ''}${rows.length} imagens\n`);
  console.log('   KB -> KB   DIMENSOES                 SSIM   q         REGRA          ARQUIVO');
  for (const r of rows.slice(0, 30)) {
    const dim = r.dims === r.newDims ? r.dims : `${r.dims} -> ${r.newDims}`;
    console.log(
      `${String(r.from).padStart(5)} ->${String(r.to).padStart(5)}   ${dim.padEnd(24)} ${r.score.toFixed(4)} ${String(r.q).padStart(8)}  ${r.rule.padEnd(14)} ${r.file}${r.keep ? '  [inalterado]' : ''}`
    );
  }

  const worst = [...rows].sort((a, b) => a.score - b.score).slice(0, 8);
  console.log('\nMenores SSIM (piores casos de qualidade):');
  for (const r of worst) console.log(`  ${r.score.toFixed(4)}  q${r.q}  ${r.file}`);

  const saved = before - after;
  console.log(`\nTotal: ${MB(before)} MB -> ${MB(after)} MB (-${MB(saved)} MB, -${Math.round((saved / before) * 100)}%)`);
  if (DRY) console.log('\nNada foi escrito. Rode sem --dry para aplicar.');
}

main().catch((e) => { console.error(e); process.exit(1); });
