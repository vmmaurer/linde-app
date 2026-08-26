export const products = [
  {
    id: 1,
    slug: 'vidro-laminado',
    title: 'Vidro Laminado',
    subtitle: 'Segurança e proteção UV',
    image: './images/LAMINADO-2.webp',
    modalImage: './images/LAMINADO-2.webp',
    // Logo de marca (opcional): preencha só onde precisar. Ex: './images/ICON-SCREENLINE.webp'
    brandLogo: '',
    // Para adicionar vídeo/fotos: preencha a lista media abaixo.
    // type: 'video' ou 'image'. Pode misturar na ordem que quiser.
    media: [
      { type: 'image', src: './images/LAMINADO-2.webp' },
      { type: 'image', src: './images/LAMINADO-5.webp' },
      { type: 'image', src: './images/LAMINADONOVO_1.webp' },
      { type: 'image', src: './images/LAMINADONOVO_2.webp' },
      { type: 'image', src: './images/LAMINADONOVO_3.webp' },
      { type: 'image', src: './images/LAMINADONOVO_5.webp' },
      { type: 'image', src: './images/LAMINADONOVO_6.webp' },

      // { type: 'video', src: './images/seu_video.mp4' },
      // { type: 'image', src: './images/outra_foto.jpg' },
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
    image: './images/LAMINADO-1.webp',
    modalImage: './images/LAMINADO-1.webp',
    brandLogo: '',
    media: [
      { type: 'image', src: './images/LAMINADO-1.webp' },
      { type: 'image', src: './images/LAMINADO-3.webp' },
      { type: 'image', src: './images/TEMPERADO-2.webp' },
      { type: 'image', src: './images/TEMPERADO-3.webp' },
      { type: 'image', src: './images/LAMINADOTEMPERADO_1.webp' },
      { type: 'image', src: './images/LAMINADOTEMPERADO_2.webp' },
      { type: 'image', src: './images/LAMINADOTEMPERADO_3.webp' },
      { type: 'image', src: './images/LAMINADOTEMPERADO_4.webp' },
      { type: 'image', src: './images/LAMINADOTEMPERADO_6.webp' },
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
    subtitle: '100X mais resistente',
    image: './images/sentryglas.webp',
    modalImage: './images/sentryglas.webp',
    // Logo de marca (opcional): preencha só onde precisar. Ex: './images/ICON-SCREENLINE.webp'
    brandLogo: './images/ICON-SENTRYGLAS.webp',
    media: [
      { type: 'image', src: './images/sentryglas.webp' },
      { type: 'image', src: './images/SENTRYGLAS_1.webp' },
      { type: 'image', src: './images/SENTRYGLAS_2.webp' },
      { type: 'image', src: './images/SENTRYGLAS_3.webp' },
      { type: 'image', src: './images/SENTRYGLAS_4.webp' },
      { type: 'image', src: './images/SENTRYGLAS_5.webp' },

      // { type: 'video', src: './images/seu_video.mp4' },
      // { type: 'image', src: './images/outra_foto.jpg' },
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
    image: './images/texturizado.webp',
    modalImage: './images/texturizado.webp',
    // Logo de marca (opcional): preencha só onde precisar. Ex: './images/ICON-SCREENLINE.webp'
    brandLogo: '',
    media: [
      { type: 'image', src: './images/texturizado.webp' },
      { type: 'image', src: './images/TEXTURIZADO_1.webp' },
      { type: 'image', src: './images/TEXTURIZADO_2.webp' },
      { type: 'image', src: './images/TEXTURIZADO_3.webp' },
      { type: 'image', src: './images/TEXTURIZADO_4.webp' },
      { type: 'image', src: './images/TEXTURIZADO_5.webp' },

      // { type: 'video', src: './images/seu_video.mp4' },
      // { type: 'image', src: './images/outra_foto.jpg' },
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
    image: './images/insulado1.webp',
    modalImage: './images/insulado1.webp',
    // Logo de marca (opcional): preencha só onde precisar. Ex: './images/ICON-SCREENLINE.webp'
    brandLogo: '',
    media: [
      { type: 'image', src: './images/insulado1.webp' },
      { type: 'image', src: './images/INSULADO-1.webp' },
      { type: 'image', src: './images/INSULADO-2.webp' },
      { type: 'image', src: './images/INSULADO-3.webp' },
      { type: 'image', src: './images/INSULADO-4.webp' },

      // { type: 'video', src: './images/seu_video.mp4' },
      // { type: 'image', src: './images/outra_foto.jpg' },
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
    // Ficha técnica (chave em src/data/fichaTecnica.js) — só quem tem este
    // campo mostra o botão "Ficha Técnica" dentro do card.
    ficha: 'habitat',
    title: 'Vidro Habitat',
    subtitle: 'Proteção Solar',
    image: './images/protecaosolar.webp',
    modalImage: './images/protecaosolar.webp',
    // Logo de marca (opcional): preencha só onde precisar. Ex: './images/ICON-SCREENLINE.webp'
    brandLogo: './images/ICON-HABITAT.webp',
    // `caption` = linha Habitat que a foto representa. O ProductModal mostra
    // essa legenda em amarelo ao lado do título e troca junto com a foto.
    // A capa (protecaosolar.webp, campo `image` acima) fica só no card da
    // roleta — aqui entram apenas as fotos das seis linhas.
    // `position` = object-position da foto. As fotos são verticais e a área
    // do carrossel é mais larga; sem isso o corte fica no meio e sobra céu.
    // O valor foi ajustado foto a foto para a construção aparecer inteira.
    media: [
      { type: 'image', src: './images/HABITAT_NEUTRO_CINZA.webp', caption: 'Neutro Cinza', position: 'center 90%' },
      { type: 'image', src: './images/HABITAT_NEUTRO_CINZA_CLARO.webp', caption: 'Neutro Cinza Claro', position: 'center 85%' },
      { type: 'image', src: './images/HABITAT_NEUTRO_INCOLOR.webp', caption: 'Neutro Incolor', position: 'center 100%' },
      { type: 'image', src: './images/HABITAT_REFLETIVO_CINZA.webp', caption: 'Refletivo Cinza', position: 'center 85%' },
      { type: 'image', src: './images/HABITAT_REFLETIVO_ESMERALDA.webp', caption: 'Refletivo Esmeralda', position: 'center 70%' },
      { type: 'image', src: './images/HABITAT_REFLETIVO_CHAMPANHE.webp', caption: 'Refletivo Champanhe', position: 'center 100%' },
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
    image: './images/espelho-novo.webp',
    modalImage: './images/espelho-novo.webp',
    // Logo de marca (opcional): preencha só onde precisar. Ex: './images/ICON-SCREENLINE.webp'
    brandLogo: '',
    media: [
      { type: 'image', src: './images/espelho-novo.webp' },
      { type: 'image', src: './images/ESPELHO_5.webp' },
      { type: 'image', src: './images/ESPELHO_4.webp' },
      { type: 'image', src: './images/ESPELHO_3.webp' },
      { type: 'image', src: './images/ESPELHO_2.webp' },
      { type: 'image', src: './images/ESPELHO_1.webp' },
      // { type: 'video', src: './images/seu_video.mp4' },
      // { type: 'image', src: './images/outra_foto.jpg' },
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
    image: './images/TEMPERADO-1.webp',
    modalImage: './images/TEMPERADO-1.webp',
    // Logo de marca (opcional): preencha só onde precisar. Ex: './images/ICON-SCREENLINE.webp'
    brandLogo: '',
    media: [
      { type: 'image', src: './images/TEMPERADO-1.webp' },
      { type: 'image', src: './images/temperado-novo.webp' },
      { type: 'image', src: './images/TEMPERADO-4.webp' },
      { type: 'image', src: './images/TEMPERADO-5.webp' },
      { type: 'image', src: './images/TEMPERADO_NOVO_1.webp' },
      { type: 'image', src: './images/TEMPERADO_NOVO_2.webp' },
      { type: 'image', src: './images/TEMPERADO_NOVO_3.webp' },
      { type: 'image', src: './images/TEMPERADO_NOVO_4.webp' },
      { type: 'image', src: './images/TEMPERADO_NOVO_5.webp' },

      // { type: 'video', src: './images/seu_video.mp4' },
      // { type: 'image', src: './images/outra_foto.jpg' },
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
    slug: 'multilaminado',
    title: 'Multilaminado',
    subtitle: 'Proteção reforçada',
    image: './images/mutilaminado.webp',
    modalImage: './images/mutilaminado.webp',
    // Logo de marca (opcional): preencha só onde precisar. Ex: './images/ICON-SCREENLINE.webp'
    brandLogo: '',
    media: [
      { type: 'image', src: './images/multilaminado2.webp' },
       { type: 'image', src: './images/MULTILAMINADO-1.webp' },
        { type: 'image', src: './images/MULTILAMINADO-2.webp' },
         { type: 'image', src: './images/MULTILAMINADO-3.webp' },
          { type: 'image', src: './images/MULTILAMINADO-4.webp' },
          { type: 'image', src: './images/LAMINADOTEMPERADO_7.webp' },
          { type: 'image', src: './images/LAMINADOTEMPERADO_5.webp' },
      // { type: 'video', src: './images/seu_video.mp4' },
      // { type: 'image', src: './images/outra_foto.jpg' },
    ],
    color: 'from-cyan-900/80 to-navy-950/90',
    description:
      'O vidro multilaminado é composto por múltiplas lâminas de vidro unidas por camadas de PVB ou SentryGlas, oferecendo elevada resistência e segurança. Indicado para aplicações que exigem proteção reforçada contra impactos e tentativas de invasão.',
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
    subtitle: 'Divisões com estilo',
    image: './images/pinazio.webp',
    modalImage: './images/pinazio.webp',
    // Logo de marca (opcional): preencha só onde precisar. Ex: './images/ICON-SCREENLINE.webp'
    brandLogo: '',
    media: [
      { type: 'image', src: './images/pinazio.webp' },
      { type: 'image', src: './images/PINAZIO-1.webp' },
      { type: 'image', src: './images/PINAZIO_2.webp' },
      { type: 'image', src: './images/PINAZIO_3.webp' },
      { type: 'image', src: './images/PINAZIO_4.webp' },
      { type: 'image', src: './images/PINAZIO_5.webp' },
    
      // { type: 'video', src: './images/seu_video.mp4' },
      // { type: 'image', src: './images/outra_foto.jpg' },
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
    subtitle: 'Praticidade sem manutenção',
    image: './images/PERSIANA_1.webp',
    modalImage: './images/PERSIANA_1.webp',
    // Logo de marca (opcional): preencha só onde precisar. Ex: './images/ICON-SCREENLINE.webp'
    brandLogo: './images/ICON-SCREENLINE.webp',
    media: [
      { type: 'image', src: './images/PERSIANA_1.webp' },
      { type: 'image', src: './images/PERSIANA_4.webp' },
      { type: 'image', src: './images/PERSIANA_5.webp' },
      { type: 'image', src: './images/PERSIANA_NOVO_1.webp' },
      { type: 'image', src: './images/PERSIANA_NOVO_2.webp' },
      { type: 'image', src: './images/PERSIANA_NOVO_3.webp' },

      // { type: 'video', src: './images/seu_video.mp4' },
      // { type: 'image', src: './images/outra_foto.jpg' },
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
    title: 'Extra Claros',
    subtitle: 'Transparência absoluta',
    image: './images/extra-clear.webp',
    modalImage: './images/extra-clear.webp',
    // Logo de marca (opcional): preencha só onde precisar. Ex: './images/ICON-SCREENLINE.webp'
    brandLogo: '',
    media: [
      { type: 'image', src: './images/extra-clear.webp' },
       { type: 'image', src: './images/EXTRACLEAR_1.webp' },
        { type: 'image', src: './images/EXTRACLEAR_2.webp' },
           { type: 'image', src: './images/EXTRACLEAR_5.webp' },
      { type: 'image', src: './images/EXTRACLEAR_NOVO_1.webp' },
      { type: 'image', src: './images/EXTRACLEAR_NOVO_2.webp' },
      { type: 'image', src: './images/EXTRACLEAR_NOVO_3.webp' },
      // { type: 'video', src: './images/seu_video.mp4' },
      // { type: 'image', src: './images/outra_foto.jpg' },
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
    subtitle: 'Acabamento personalizado',
    image: './images/CARD-SERIGRAFIA.webp',
    modalImage: './images/CARD-SERIGRAFIA.webp',
    // Logo de marca (opcional): preencha só onde precisar. Ex: './images/ICON-SCREENLINE.webp'
    brandLogo: '',
    media: [
      { type: 'image', src: './images/SERIGRAFIA-1.webp' },
       { type: 'image', src: './images/SERIGRAFIA-2.webp' },
        { type: 'image', src: './images/SERIGRAFIA-3.webp' },
         { type: 'image', src: './images/SERIGRAFIA-4.webp' },
          { type: 'image', src: './images/SERIGRAFIA-5.webp' },
      { type: 'image', src: './images/SERIGRAFIANOVA_1.webp' },
      { type: 'image', src: './images/SERIGRAFIANOVA_2.webp' },
      { type: 'image', src: './images/SERIGRAFIANOVA_3.webp' },
      // { type: 'image', src: './images/outra_foto.jpg' },
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
    subtitle: 'Eficiência energética',
    image: './images/low-e-novo.webp',
    modalImage: './images/low-e-novo.webp',
    // Logo de marca (opcional): preencha só onde precisar. Ex: './images/ICON-SCREENLINE.webp'
    brandLogo: '',
    media: [
      { type: 'image', src: './images/low-e-novo.webp' },
      { type: 'image', src: './images/LOWE_1.webp' },
      { type: 'image', src: './images/LOWE_2.webp' },
      { type: 'image', src: './images/LOWE_3.webp' },
      { type: 'image', src: './images/LOWE_4.webp' },
      { type: 'image', src: './images/LOWE_5.webp' },

      // { type: 'video', src: './images/seu_video.mp4' },
      // { type: 'image', src: './images/outra_foto.jpg' },
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
  {
    id: 15,
    slug: 'smart-glass',
    title: 'Smart Glass',
    subtitle: 'Privacidade sob controle',
    // ATENÇÃO: imagens temporárias (banco gratuito Pexels) até chegarem as
    // fotos da Linde. Trocar os arquivos SMARTGLASS_*.webp em public/images.
    image: './images/SMARTGLASS_1.webp',
    modalImage: './images/SMARTGLASS_1.webp',
    brandLogo: '',
    media: [
      { type: 'image', src: './images/SMARTGLASS_1.webp' },
      { type: 'image', src: './images/SMARTGLASS_2.webp' },
    ],
    color: 'from-slate-800/80 to-navy-950/90',
    description:
      'O Smart Glass é um vidro laminado com película inteligente que alterna entre transparente e opaco ao toque de um botão. Em segundos o ambiente ganha privacidade total, sem cortinas ou persianas, preservando a entrada de luz natural e o visual limpo do vidro.',
    applications: [
      'Salas de reunião e ambientes corporativos',
      'Consultórios, clínicas e hospitais',
      'Divisórias e áreas íntimas residenciais',
    ],
  },
  {
    id: 16,
    slug: 'pelicula-seguranca',
    title: 'Película de Segurança',
    subtitle: 'Proteção sem trocar o vidro',
    // Imagens temporárias — trocar PELICULA_*.webp em public/images.
    image: './images/PELICULA_1.webp',
    modalImage: './images/PELICULA_1.webp',
    brandLogo: '',
    media: [
      { type: 'image', src: './images/PELICULA_1.webp' },
      { type: 'image', src: './images/PELICULA_2.webp' },
    ],
    color: 'from-blue-900/80 to-navy-950/90',
    description:
      'A película de segurança é aplicada sobre o vidro já instalado e mantém os fragmentos unidos em caso de quebra, reduzindo o risco de acidentes. Também filtra raios UV e auxilia no controle de calor e ofuscamento, sendo a solução mais rápida para reforçar vidros existentes.',
    applications: [
      'Vitrines e fachadas comerciais',
      'Portas e janelas residenciais',
      'Reforço de vidros já instalados',
    ],
  },
  {
    id: 17,
    slug: 'anti-chama',
    title: 'Anti Chama',
    subtitle: 'Resistência ao fogo',
    // Imagens temporárias — trocar ANTICHAMA_*.webp em public/images.
    image: './images/ANTICHAMA_1.webp',
    modalImage: './images/ANTICHAMA_1.webp',
    brandLogo: '',
    media: [
      { type: 'image', src: './images/ANTICHAMA_1.webp' },
      { type: 'image', src: './images/ANTICHAMA_2.webp' },
    ],
    color: 'from-orange-900/80 to-navy-950/90',
    description:
      'Os vidros resistentes ao fogo formam uma barreira contra fumaça, chamas e gases tóxicos por até 120 minutos, reduzindo o calor irradiado e garantindo tempo para a evacuação. São vidros de segurança temperados e laminados, estáveis aos raios UV, com classificações de E/EW30 a EW120 e de EI30 a EI120 conforme o nível de proteção exigido.',
    applications: [
      'Portas e paredes corta-fogo',
      'Visores em drywall e alvenaria',
      'Fachadas, claraboias e rotas de fuga',
    ],
  },
]
