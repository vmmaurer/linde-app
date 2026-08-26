// ══════════════════════════════════════════════════════════════
//  FICHA TÉCNICA — VIDROS HABITAT
//  Dados de desempenho luminoso e energético das duas linhas
//  (Neutro e Refletivo). Usado pelo FichaTecnicaModal, que é
//  aberto pelo botão "Ficha Técnica" do card do Vidro Habitat.
//
//  Em cada métrica:
//    • array  → um valor por espessura (4/6/8/10 mm ou 3+3/4+4/4+6/6+6)
//    • string → valor único, mesclado em todas as espessuras do grupo
// ══════════════════════════════════════════════════════════════

const ESPESSURAS_MONO = ['4 mm', '6 mm', '8 mm', '10 mm']
const ESPESSURAS_LAM = ['3+3', '4+4', '4+6', '6+6']

const NOTA_UV = '*Quando laminado pela Cebrace o desempenho de Proteção UV do produto é de 99,6%.'

// Monta as 4 métricas de um vidro na ordem padrão da ficha Cebrace.
const metricas = ({ tl, rle, ps, uv }) => [
  { grupo: 'Fatores Luminosos', label: 'Transmissão de Luz (%)', abbr: 'TL', ...tl },
  { grupo: 'Fatores Luminosos', label: 'Reflexão Externa (%)', abbr: 'RLe', ...rle },
  { grupo: 'Fatores de Energia', label: 'Proteção Solar', abbr: 'PS%', ...ps },
  { grupo: 'Fatores de Energia', label: 'Proteção UV*', abbr: 'UV', ...uv },
]

export const fichaHabitat = {
  eyebrow: 'Ficha Técnica',
  titulo: 'Vidros Habitat',
  brandLogo: './images/ICON-HABITAT.webp',
  colunas: { mono: ESPESSURAS_MONO, lam: ESPESSURAS_LAM },
  linhas: [
    {
      id: 'neutro',
      label: 'Habitat Neutro',
      resumo: 'Controle solar com aparência neutra e alta transmissão de luz',
      accent: '#8fb9d9',
      nota: NOTA_UV,
      vidros: [
        {
          nome: 'Habitat Neutro Cinza',
          // Tons do próprio vidro — usados no swatch e no realce do bloco
          tint: ['#6e767e', '#9aa3ab'],
          accent: '#9fb0bf',
          metricas: metricas({
            tl:  { mono: [51, 50, 50, 49], lam: [53, 53, 52, 51] },
            rle: { mono: [18, 18, 17, 17], lam: [15, 15, 15, 15] },
            ps:  { mono: [45, 46, 47, 49], lam: [44, 45, 47, 48] },
            uv:  { mono: '67%', lam: '*99,6%' },
          }),
        },
        {
          nome: 'Habitat Neutro Cinza Claro',
          tint: ['#98a0a6', '#c3cad0'],
          accent: '#c3ced8',
          metricas: metricas({
            tl:  { mono: [59, 58, 57, 56], lam: [63, 62, 61, 60] },
            rle: { mono: [19, 18, 18, 18], lam: [15, 14, 14, 14] },
            ps:  { mono: [39, 41, 42, 44], lam: [40, 41, 43, 44] },
            uv:  { mono: ['60%', '64%', '68%', '70%'], lam: ['99%', '99%', '99%', '99%'] },
          }),
        },
        {
          nome: 'Habitat Neutro Incolor',
          tint: ['#b9d8de', '#e6f4f6'],
          accent: '#a8dbe6',
          metricas: metricas({
            tl:  { mono: [66, 65, 64, 64], lam: [70, 69, 68, 68] },
            rle: { mono: [19, 19, 18, 18], lam: [13, 13, 13, 13] },
            ps:  { mono: [32, 34, 36, 38], lam: [34, 36, 38, 39] },
            uv:  { mono: '57%', lam: '99,6%' },
          }),
        },
      ],
    },
    {
      id: 'refletivo',
      label: 'Habitat Refletivo',
      resumo: 'Camada refletiva para máxima proteção solar e privacidade',
      accent: '#6fc9b4',
      nota: NOTA_UV,
      vidros: [
        {
          nome: 'Habitat Refletivo Cinza',
          tint: ['#5d666e', '#a7b1b8'],
          accent: '#a9b7c2',
          metricas: metricas({
            tl:  { mono: [21, 21, 20, 20], lam: [21, 21, 20, 20] },
            rle: { mono: [32, 31, 30, 30], lam: [30, 30, 30, 29] },
            ps:  { mono: [71, 70, 71, 71], lam: [70, 71, 71, 71] },
            uv:  { mono: ['84%', '85%', '86%', '87%'], lam: ['*99,6%', '*99,8%', '*99,8%', '*99,8%'] },
          }),
        },
        {
          nome: 'Habitat Refletivo Esmeralda',
          tint: ['#1f6d59', '#59b39a'],
          accent: '#5fc3a6',
          metricas: metricas({
            tl:  { mono: [21, 20, 19, 17], lam: [27, 26, 25, 24] },
            rle: { mono: [40, 36, 32, 29], lam: [38, 36, 36, 32] },
            ps:  { mono: [66, 68, 70, 71], lam: [62, 64, 65, 67] },
            uv:  { mono: ['96%', '97%', '98%', '98%'], lam: ['99,6%', '99,6%', '99,6%', '99,7%'] },
          }),
        },
        {
          nome: 'Habitat Refletivo Champanhe',
          tint: ['#a8834a', '#e0c191'],
          accent: '#e0bd85',
          metricas: metricas({
            tl:  { mono: [34, 31, 30, 30], lam: [39, 38, 37, 35] },
            rle: { mono: [46, 49, 48, 47], lam: [44, 44, 44, 44] },
            ps:  { mono: [50, 54, 55, 56], lam: [50, 52, 53, 54] },
            uv:  { mono: ['91%', '93%', '93%', '93%'], lam: ['99,8%', '99,9%', '99,9%', '99,5%'] },
          }),
        },
      ],
    },
  ],
}

// Registro por chave — o produto aponta para a ficha pelo campo `ficha`.
export const fichasTecnicas = {
  habitat: fichaHabitat,
}
