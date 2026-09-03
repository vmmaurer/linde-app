// ── Utilidades de texto do catálogo ──

/**
 * Tira acento e caixa. É o que faz "pinazio" achar "Pinázio" e
 * "pelicula" achar "Película de Segurança" — o vendedor digita com
 * pressa, no teclado do celular, e ninguém acentua nessa hora.
 */
export const normalizar = (s = '') =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

/** Primeira letra do nome, já sem acento (é a letra da trilha A–Z). */
export const inicial = (titulo = '') => (normalizar(titulo)[0] || '#').toUpperCase()

/**
 * Quebra o texto nos trechos que casam com o termo buscado, para o
 * componente pintar o pedaço encontrado. Devolve uma lista de
 * { txt, marcado } na ordem original — sem HTML solto.
 */
export function fatiarBusca(texto = '', termo = '') {
  const alvo = normalizar(termo)
  if (!alvo) return [{ txt: texto, marcado: false }]

  const base = normalizar(texto)
  const partes = []
  let cursor = 0

  // normalizar() não muda a quantidade de caracteres para as letras que
  // aparecem nos nomes dos vidros (só remove os acentos combinantes), então
  // o índice encontrado em `base` vale também em `texto`.
  let achou = base.indexOf(alvo, cursor)
  while (achou !== -1) {
    if (achou > cursor) partes.push({ txt: texto.slice(cursor, achou), marcado: false })
    partes.push({ txt: texto.slice(achou, achou + alvo.length), marcado: true })
    cursor = achou + alvo.length
    achou = base.indexOf(alvo, cursor)
  }
  if (cursor < texto.length) partes.push({ txt: texto.slice(cursor), marcado: false })

  return partes
}
