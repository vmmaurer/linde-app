export const products = [
  {
    id: 1,
    slug: 'vidro-laminado',
    title: 'Vidro Laminado',
    subtitle: 'Laminado',
    image: '/images/laminado1.png',
    modalImage: '/images/laminado1.png',
    // Logo de marca (opcional): preencha só onde precisar. Ex: '/images/ICON-SCREENLINE.png'
    brandLogo: '',
    // Para adicionar vídeo/fotos: preencha a lista media abaixo.
    // type: 'video' ou 'image'. Pode misturar na ordem que quiser.
    media: [
      { type: 'image', src: '/images/laminado1.png' },
      { type: 'image', src: '/images/LAMINADO-2.png' },
      { type: 'image', src: '/images/LAMINADO-5.png' },
      { type: 'image', src: '/images/LAMINADONOVO_1.png' },
      { type: 'image', src: '/images/LAMINADONOVO_2.png' },
      { type: 'image', src: '/images/LAMINADONOVO_3.png' },
      { type: 'image', src: '/images/LAMINADONOVO_4.png' },
      { type: 'image', src: '/images/LAMINADONOVO_5.png' },
      { type: 'image', src: '/images/LAMINADONOVO_6.png' },

      // { type: 'video', src: '/images/seu_video.mp4' },
      // { type: 'image', src: '/images/outra_foto.jpg' },
    ],
    color: 'from-cyan-900/80 to-navy-950/90',
    description:
      'Composto por duas ou mais chapas de vidro unidas por uma camada intermediária, o vidro laminado oferece maior segurança, pois mantém os fragmentos presos em caso de quebra. Além disso, bloqueia até 99% dos raios UV, contribuindo para a proteção de pessoas e ambientes.',
    applications: [
      'Guarda-corpos e corrimãos',
      'Fachadas e vitrines',
      'Coberturas e claraboias',
    ],
  },
  {
    id: 14,
    slug: 'laminado-temperado',
    title: 'Laminado Temperado',
    subtitle: 'Segurança e resistência',
    image: '/images/LAMINADO-1.png',
    modalImage: '/images/LAMINADO-1.png',
    brandLogo: '',
    media: [
      { type: 'image', src: '/images/LAMINADO-1.png' },
      { type: 'image', src: '/images/LAMINADO-3.png' },
      { type: 'image', src: '/images/TEMPERADO-2.png' },
      { type: 'image', src: '/images/TEMPERADO-3.png' },
      { type: 'image', src: '/images/LAMINADOTEMPERADO_1.png' },
      { type: 'image', src: '/images/LAMINADOTEMPERADO_2.png' },
      { type: 'image', src: '/images/LAMINADOTEMPERADO_3.png' },
      { type: 'image', src: '/images/LAMINADOTEMPERADO_4.png' },
      { type: 'image', src: '/images/LAMINADOTEMPERADO_5.png' },
      { type: 'image', src: '/images/LAMINADOTEMPERADO_6.png' },
      { type: 'image', src: '/images/LAMINADOTEMPERADO_7.png' },
    ],
    color: 'from-cyan-900/80 to-navy-950/90',
    description:
      'O vidro laminado temperado combina a resistência do processo de têmpera com a segurança da laminação. Em caso de quebra, seus fragmentos permanecem aderidos à camada intermediária, oferecendo proteção reforçada para aplicações que exigem alto desempenho.',
    applications: [
      'Fachadas e vitrines',
      'Guarda-corpos e corrimãos',
      'Coberturas e estruturas especiais',
    ],
  },
  {
    id: 2,
    slug: 'SentryGlas',
    title: 'SentryGlas',
    subtitle: 'Maior resistência',
    image: '/images/sentryglas.png',
    modalImage: '/images/sentryglas.png',
    // Logo de marca (opcional): preencha só onde precisar. Ex: '/images/ICON-SCREENLINE.png'
    brandLogo: '/images/ICON-SENTRYGLAS.png',
    media: [
      { type: 'image', src: '/images/sentryglas.png' },
      { type: 'image', src: '/images/SENTRYGLAS_1.png' },
      { type: 'image', src: '/images/SENTRYGLAS_2.png' },
      { type: 'image', src: '/images/SENTRYGLAS_3.png' },
      { type: 'image', src: '/images/SENTRYGLAS_4.png' },
      { type: 'image', src: '/images/SENTRYGLAS_5.png' },

      // { type: 'video', src: '/images/seu_video.mp4' },
      // { type: 'image', src: '/images/outra_foto.jpg' },
    ],
    color: 'from-blue-900/80 to-navy-950/90',
    description:
      'O vidro laminado com SentryGlas® utiliza um interlayer ionoplástico de alta performance, proporcionando resistência estrutural superior e maior segurança. Sua tecnologia oferece excelente proteção contra impactos, intempéries e cargas elevadas, permitindo soluções arquitetônicas mais arrojadas e duráveis.',
    applications: [
      'Pisos e passarelas de vidro',
      'Guarda-corpos estruturais',
      'Coberturas e fachadas especiais',
    ],
  },
  {
    id: 3,
    slug: 'vidro-texturizado',
    title: 'Vidro Texturizado',
    subtitle: 'Estilo e privacidade',
    image: '/images/texturizado.png',
    modalImage: '/images/texturizado.png',
    // Logo de marca (opcional): preencha só onde precisar. Ex: '/images/ICON-SCREENLINE.png'
    brandLogo: '',
    media: [
      { type: 'image', src: '/images/texturizado.png' },
      { type: 'image', src: '/images/TEXTURIZADO_1.png' },
      { type: 'image', src: '/images/TEXTURIZADO_2.png' },
      { type: 'image', src: '/images/TEXTURIZADO_3.png' },
      { type: 'image', src: '/images/TEXTURIZADO_4.png' },
      { type: 'image', src: '/images/TEXTURIZADO_5.png' },

      // { type: 'video', src: '/images/seu_video.mp4' },
      // { type: 'image', src: '/images/outra_foto.jpg' },
    ],
    color: 'from-indigo-900/80 to-navy-950/90',
    description:
      'O vidro texturizado possui desenhos em relevo em sua superfície, combinando estética, privacidade e iluminação natural. Sua textura difunde a luz de forma suave, criando ambientes mais confortáveis e sofisticados sem bloquear a luminosidade.',
    applications: [
      'Portas e divisórias internas',
      'Boxes de banheiro',
      'Fachadas e elementos decorativos',
    ],
  },
  {
    id: 4,
    slug: 'vidro-insulado',
    title: 'Vidro Insulado',
    subtitle: 'Conforto total',
    image: '/images/insulado1.png',
    modalImage: '/images/insulado1.png',
    // Logo de marca (opcional): preencha só onde precisar. Ex: '/images/ICON-SCREENLINE.png'
    brandLogo: '',
    media: [
      { type: 'image', src: '/images/insulado1.png' },
      { type: 'image', src: '/images/INSULADO-1.png' },
      { type: 'image', src: '/images/INSULADO-2.png' },
      { type: 'image', src: '/images/INSULADO-3.jpeg' },
      { type: 'image', src: '/images/INSULADO-4.png' },

      // { type: 'video', src: '/images/seu_video.mp4' },
      // { type: 'image', src: '/images/outra_foto.jpg' },
    ],
    color: 'from-slate-800/80 to-navy-950/90',
    description:
      'O vidro insulado é composto por duas ou mais placas de vidro separadas por uma câmara de ar desidratada e hermeticamente selada. Essa configuração proporciona excelente isolamento térmico e acústico, aumentando o conforto dos ambientes sem comprometer a entrada de luz natural.',
    applications: [
      'Janelas e portas residenciais',
      'Fachadas e esquadrias de alto desempenho',
      'Ambientes que exigem conforto térmico e acústico',
    ],
  },
  {
    id: 5,
    slug: 'vidro-habitat',
    title: 'Vidro Habitat',
    subtitle: 'Proteção Solar',
    image: '/images/protecaosolar.png',
    modalImage: '/images/protecaosolar.png',
    // Logo de marca (opcional): preencha só onde precisar. Ex: '/images/ICON-SCREENLINE.png'
    brandLogo: '/images/ICON-HABITAT.png',
    media: [
      { type: 'image', src: '/images/protecaosolar.png' },
      { type: 'image', src: '/images/HABITAT_1.jpg.jpeg' },
      { type: 'image', src: '/images/HABITAT_2.jpg.jpeg' },
      { type: 'image', src: '/images/HABITAT_3.png' },
      { type: 'image', src: '/images/HABITAT_4.png' },
      { type: 'image', src: '/images/HABITAT_5.png' },
      // { type: 'video', src: '/images/seu_video.mp4' },
      // { type: 'image', src: '/images/outra_foto.jpg' },
    ],
    color: 'from-amber-900/80 to-navy-950/90',
    description:
      'O vidro Habitat combina controle solar, conforto e segurança, reduzindo a entrada de calor e bloqueando raios UV que podem danificar móveis e revestimentos. Sua tecnologia contribui para ambientes mais agradáveis, com maior eficiência energética e integração entre áreas internas e externas.',
    applications: [
      'Fachadas residenciais',
      'Portas e janelas de alto desempenho',
      'Varandas e áreas envidraçadas',
    ],
  },
  {
    id: 6,
    slug: 'Espelhos',
    title: 'Espelhos',
    subtitle: 'Precisão e acabamento impecável',
    image: '/images/espelho-novo.png',
    modalImage: '/images/espelho-novo.png',
    // Logo de marca (opcional): preencha só onde precisar. Ex: '/images/ICON-SCREENLINE.png'
    brandLogo: '',
    media: [
      { type: 'image', src: '/images/espelho-novo.png' },
      { type: 'image', src: '/images/ESPELHO_5.png' },
      { type: 'image', src: '/images/ESPELHO_4.png' },
      { type: 'image', src: '/images/ESPELHO_3.png' },
      { type: 'image', src: '/images/ESPELHO_2.png' },
      { type: 'image', src: '/images/ESPELHO_1.png' },
      // { type: 'video', src: '/images/seu_video.mp4' },
      // { type: 'image', src: '/images/outra_foto.jpg' },
    ],
    color: 'from-purple-900/80 to-navy-950/90',
    description:
      'Os espelhos ampliam a sensação de espaço, valorizam a iluminação dos ambientes e agregam sofisticação aos projetos. Disponíveis em diferentes tonalidades e formatos, são versáteis e podem ser utilizados tanto para fins decorativos quanto funcionais.',
    applications: [
      'Decoração de interiores',
      'Móveis e painéis decorativos',
      'Academias, lojas e ambientes corporativos',
    ],
  },
  {
    id: 7,
    slug: 'Temperado',
    title: 'Temperado',
    subtitle: 'Qualidade garantida',
    image: '/images/temperado-novo.png',
    modalImage: '/images/temperado-novo.png',
    // Logo de marca (opcional): preencha só onde precisar. Ex: '/images/ICON-SCREENLINE.png'
    brandLogo: '',
    media: [
      { type: 'image', src: '/images/temperado-novo.png' },
      { type: 'image', src: '/images/TEMPERADO-1.png' },
      { type: 'image', src: '/images/TEMPERADO-4.png' },
      { type: 'image', src: '/images/TEMPERADO-5.png' },
      { type: 'image', src: '/images/TEMPERADO_NOVO_1.png' },
      { type: 'image', src: '/images/TEMPERADO_NOVO_2.png' },
      { type: 'image', src: '/images/TEMPERADO_NOVO_3.png' },
      { type: 'image', src: '/images/TEMPERADO_NOVO_4.png' },
      { type: 'image', src: '/images/TEMPERADO_NOVO_5.png' },

      // { type: 'video', src: '/images/seu_video.mp4' },
      // { type: 'image', src: '/images/outra_foto.jpg' },
    ],
    color: 'from-teal-900/80 to-navy-950/90',
    description:
      'O vidro temperado passa por um processo de aquecimento e resfriamento controlado que aumenta sua resistência mecânica em até quatro vezes em comparação ao vidro comum. Também oferece maior resistência térmica e, em caso de quebra, fragmenta-se em pequenos pedaços menos cortantes, proporcionando mais segurança.',
    applications: [
      'Portas e divisórias',
      'Boxes de banheiro',
      'Tampos de mesa e móveis de vidro',
    ],
  },
  {
    id: 8,
    slug: 'Multi Laminado',
    title: 'Multi Laminado',
    subtitle: 'MultiLaminado',
    image: '/images/mutilaminado.jpeg',
    modalImage: '/images/mutilaminado.jpeg',
    // Logo de marca (opcional): preencha só onde precisar. Ex: '/images/ICON-SCREENLINE.png'
    brandLogo: '',
    media: [
      { type: 'image', src: '/images/multilaminado2.jpeg' },
       { type: 'image', src: '/images/MULTILAMINADO-1.png' },
        { type: 'image', src: '/images/MULTILAMINADO-2.png' },
         { type: 'image', src: '/images/MULTILAMINADO-3.png' },
          { type: 'image', src: '/images/MULTILAMINADO-4.png' },
           { type: 'image', src: '/images/MULTILAMINADO-5.png' },
      // { type: 'video', src: '/images/seu_video.mp4' },
      // { type: 'image', src: '/images/outra_foto.jpg' },
    ],
    color: 'from-cyan-900/80 to-navy-950/90',
    description:
      'O vidro multilaminado é composto por múltiplas lâminas de vidro unidas por camadas de PVB, oferecendo elevada resistência e segurança. Indicado para aplicações que exigem proteção reforçada contra impactos e tentativas de invasão.',
    applications: [
      'Agências bancárias e guaritas',
      'Vitrines e joalherias',
      'Pisos e visores de piscina',
    ],
  },
  {
    id: 9,
    slug: 'Pinázio',
    title: 'Pinázio',
    subtitle: 'Pinázio',
    image: '/images/pinazio.jpeg',
    modalImage: '/images/pinazio.jpeg',
    // Logo de marca (opcional): preencha só onde precisar. Ex: '/images/ICON-SCREENLINE.png'
    brandLogo: '',
    media: [
      { type: 'image', src: '/images/pinazio.jpeg' },
      { type: 'image', src: '/images/PINAZIO-1.png' },
      { type: 'image', src: '/images/PINAZIO_2.png' },
      { type: 'image', src: '/images/PINAZIO_3.png' },
      { type: 'image', src: '/images/PINAZIO_4.png' },
      { type: 'image', src: '/images/PINAZIO_5.png' },
    
      // { type: 'video', src: '/images/seu_video.mp4' },
      // { type: 'image', src: '/images/outra_foto.jpg' },
    ],
    color: 'from-cyan-900/80 to-navy-950/90',
    description:
      'O pinázio é um perfil interno aplicado em vidros insulados que cria divisões visuais entre os vãos, agregando estética e personalidade ao projeto. Ele reproduz o aspecto de esquadrias segmentadas sem comprometer a praticidade e o desempenho do conjunto.',
    applications: [
      'Portas e janelas residenciais',
      'Fachadas com estilo clássico ou colonial',
      'Projetos arquitetônicos com design personalizado',
    ],
  },
  {
    id: 10,
    slug: 'persiana-integrada',
    title: 'Persiana Integrada',
    subtitle: 'Persiana Integrada',
    image: '/images/PERSIANA_1.png',
    modalImage: '/images/PERSIANA_1.png',
    // Logo de marca (opcional): preencha só onde precisar. Ex: '/images/ICON-SCREENLINE.png'
    brandLogo: '/images/ICON-SCREENLINE.png',
    media: [
      { type: 'image', src: '/images/PERSIANA_1.png' },
      { type: 'image', src: '/images/persiana.png' },
      { type: 'image', src: '/images/PERSIANA_3.png' },
      { type: 'image', src: '/images/PERSIANA_4.png' },
      { type: 'image', src: '/images/PERSIANA_5.png' },
      { type: 'image', src: '/images/PERSIANA_NOVO_1.png' },
      { type: 'image', src: '/images/PERSIANA_NOVO_2.png' },
      { type: 'image', src: '/images/PERSIANA_NOVO_3.png' },

      // { type: 'video', src: '/images/seu_video.mp4' },
      // { type: 'image', src: '/images/outra_foto.jpg' },
    ],
    color: 'from-cyan-900/80 to-navy-950/90',
    description:
      'A persiana integrada é instalada no interior do vidro insulado, protegida contra poeira, umidade e desgaste, garantindo praticidade, durabilidade e baixa manutenção. Produzida sob encomenda com tecnologia ScreenLine® e montada pela Linde Vidros, oferece controle de luminosidade e privacidade sem comprometer a estética do ambiente.',
    applications: [
      'Janelas e portas residenciais',
      'Ambientes corporativos e salas de reunião',
      'Hospitais, clínicas e hotéis',
    ],
  },
  {
    id: 11,
    slug: 'extra-clear',
    title: 'Extra Clear',
    subtitle: 'Extra Clear',
    image: '/images/extra-clear.png',
    modalImage: '/images/extra-clear.png',
    // Logo de marca (opcional): preencha só onde precisar. Ex: '/images/ICON-SCREENLINE.png'
    brandLogo: '',
    media: [
      { type: 'image', src: '/images/extra-clear.png' },
       { type: 'image', src: '/images/EXTRACLEAR_1.png' },
        { type: 'image', src: '/images/EXTRACLEAR_2.png' },
          { type: 'image', src: '/images/EXTRACLEAR_4.png' },
           { type: 'image', src: '/images/EXTRACLEAR_5.png' },
      { type: 'image', src: '/images/EXTRACLEAR_NOVO_1.png' },
      { type: 'image', src: '/images/EXTRACLEAR_NOVO_2.png' },
      { type: 'image', src: '/images/EXTRACLEAR_NOVO_3.png' },
      // { type: 'video', src: '/images/seu_video.mp4' },
      // { type: 'image', src: '/images/outra_foto.jpg' },
    ],
    color: 'from-cyan-900/80 to-navy-950/90',
    description:
      'O vidro extra clear possui elevada transparência e neutralidade, proporcionando maior fidelidade às cores e uma visualização mais nítida dos ambientes e objetos. Versátil, pode ser utilizado em diferentes composições e transformações, agregando sofisticação aos projetos.',
    applications: [
      'Vitrines e fachadas comerciais',
      'Guarda-corpos e divisórias',
      'Móveis e peças decorativas de alto padrão',
    ],
  },
  
  {
    id: 12,
    slug: 'serigrafia',
    title: 'Serigrafia',
    subtitle: 'Serigrafia',
    image: '/images/CARD-SERIGRAFIA.png',
    modalImage: '/images/CARD-SERIGRAFIA.png',
    // Logo de marca (opcional): preencha só onde precisar. Ex: '/images/ICON-SCREENLINE.png'
    brandLogo: '',
    media: [
      { type: 'video', src: '/images/siregrafia.mp4' },
      { type: 'image', src: '/images/SERIGRAFIA-1.png' },
       { type: 'image', src: '/images/SERIGRAFIA-2.png' },
        { type: 'image', src: '/images/SERIGRAFIA-3.png' },
         { type: 'image', src: '/images/SERIGRAFIA-4.png' },
          { type: 'image', src: '/images/SERIGRAFIA-5.png' },
      { type: 'image', src: '/images/SERIGRAFIANOVA_1.png' },
      { type: 'image', src: '/images/SERIGRAFIANOVA_2.png' },
      { type: 'image', src: '/images/SERIGRAFIANOVA_3.png' },
      // { type: 'image', src: '/images/outra_foto.jpg' },
    ],
    color: 'from-cyan-900/80 to-navy-950/90',
    description:
      'O vidro serigrafado recebe uma aplicação de tinta que proporciona acabamento sofisticado, personalização e alta durabilidade. Disponível nas versões temperada ou pintura fria, permite uma ampla variedade de cores e aplicações decorativas.',
    applications: [
      'Revestimentos de paredes',
      'Mobiliário e decoração de interiores',
      'Ambientes corporativos e comerciais',
    ],
  },
  {
    id: 13,
    slug: 'Low-E',
    title: 'Low-E',
    subtitle: 'Low-E',
    image: '/images/low-e-novo.png',
    modalImage: '/images/low-e-novo.png',
    // Logo de marca (opcional): preencha só onde precisar. Ex: '/images/ICON-SCREENLINE.png'
    brandLogo: '',
    media: [
      { type: 'image', src: '/images/low-e-novo.png' },
      { type: 'image', src: '/images/LOWE_1.png' },
      { type: 'image', src: '/images/LOWE_2.png' },
      { type: 'image', src: '/images/LOWE_3.png' },
      { type: 'image', src: '/images/LOWE_4.png' },
      { type: 'image', src: '/images/LOWE_5.png' },

      // { type: 'video', src: '/images/seu_video.mp4' },
      // { type: 'image', src: '/images/outra_foto.jpg' },
    ],
    color: 'from-cyan-900/80 to-navy-950/90',
    description:
      'O vidro Low-E (baixa emissividade) possui uma camada metálica especial que reduz a transferência de calor através do vidro, contribuindo para maior eficiência energética e conforto térmico. Sua tecnologia permite aproveitar a luz natural enquanto minimiza o ganho ou a perda de calor dos ambientes.',
    applications: [
      'Vidros insulados de alto desempenho',
      'Fachadas residenciais e comerciais',
      'Ambientes climatizados com foco em eficiência energética',
    ],
  },
]

export const beforeAfterExamples = [
  {
    id: 1,
    label: 'Escritório Corporativo',
    before: '/images/casacolor13-vblack.png',
    after: '/images/casacolor13.jpg',
  },
  {
    id: 2,
    label: 'Varanda Residencial',
    before: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80',
    after: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80',
  },
  {
    id: 3,
    label: 'Banheiro Moderno',
    before: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=80',
    after: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&q=80',
  },
]
