/**
 * SSIM (Structural Similarity) em escala de cinza — mede perda PERCEPTUAL,
 * nao diferenca de bytes. Referencia: Wang et al., 2004.
 *
 *   1.000  = identico
 *   >0.99  = diferenca invisivel a olho nu
 *   >0.98  = indistinguivel em uso normal
 *   <0.95  = comeca a aparecer (borrao, banding, blocos)
 *
 * Usamos isto para provar que a recompressao nao degradou a imagem, em vez
 * de confiar no "quality: 82" na fe.
 */
import sharp from 'sharp';

const C1 = (0.01 * 255) ** 2;
const C2 = (0.03 * 255) ** 2;

// flatten() antes de greyscale() e obrigatorio: em WebP/PNG com alfa, os canais
// RGB debaixo de pixels 100% transparentes sao lixo arbitrario que o encoder
// reescreve a vontade. Sem achatar, o SSIM mede esse lixo invisivel e acusa
// 'perda' de 30% num icone que na tela esta identico.
async function gray(buf, width, height) {
  return sharp(buf)
    .resize(width, height, { fit: 'fill' })
    .flatten({ background: '#808080' })
    .greyscale()
    .raw()
    .toBuffer();
}

export async function ssim(bufA, bufB) {
  // Compara na resolucao da MENOR das duas: e assim que o pixel chega a tela.
  const [ma, mb] = await Promise.all([sharp(bufA).metadata(), sharp(bufB).metadata()]);
  const width = Math.min(ma.width, mb.width);
  const height = Math.min(ma.height, mb.height);
  const [a, b] = await Promise.all([gray(bufA, width, height), gray(bufB, width, height)]);

  // Janela deslizante 8x8 com passo 4.
  const win = 8;
  const step = 4;
  let total = 0;
  let n = 0;

  for (let y = 0; y + win <= height; y += step) {
    for (let x = 0; x + win <= width; x += step) {
      let sa = 0, sb = 0, saa = 0, sbb = 0, sab = 0;
      for (let j = 0; j < win; j++) {
        const row = (y + j) * width + x;
        for (let i = 0; i < win; i++) {
          const va = a[row + i];
          const vb = b[row + i];
          sa += va; sb += vb;
          saa += va * va; sbb += vb * vb; sab += va * vb;
        }
      }
      const cnt = win * win;
      const mA = sa / cnt;
      const mB = sb / cnt;
      const vA = saa / cnt - mA * mA;
      const vB = sbb / cnt - mB * mB;
      const cov = sab / cnt - mA * mB;
      total += ((2 * mA * mB + C1) * (2 * cov + C2)) /
               ((mA * mA + mB * mB + C1) * (vA + vB + C2));
      n++;
    }
  }
  return n ? total / n : 1;
}
