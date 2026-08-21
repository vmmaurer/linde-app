/**
 * Devolve public/images ao estado original (image-originals/).
 * Use se algum recorte da otimizacao nao agradar visualmente.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const SRC = 'public/images';
const BACKUP = 'image-originals';

const files = await fs.readdir(BACKUP).catch(() => {
  console.error(`Nada a restaurar: ${BACKUP} nao existe.`);
  process.exit(1);
});

for (const f of files) {
  await fs.copyFile(path.join(BACKUP, f), path.join(SRC, f));
}
console.log(`${files.length} imagens restauradas de ${BACKUP}.`);
