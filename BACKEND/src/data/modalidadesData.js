// Arquivo: InterDoZero/src/data/modalidadesData.js
// VERSÃO 1.4 - CAMINHOS DE IMAGEM CORRIGIDOS E LÓGICA "PREGIL"

// (Sem 'import' de imagens)

const modalidades = [
  // --- 1. FUTSAL (Grupo) ---
  {
    _id: 1,
    nome: 'Futsal',
    slug: 'futsal',
    imageUrl: '/images/futsal.png', // <-- CAMINHO CORRIGIDO
    descricao: "O Futsal do Intergil é pura emoção...",
    linkEdital: "#FUTSAL_GERAL_EDITAL",
    submodalidades: [
      { nome: "Futsal 5x5 (Feminino)", isPrincipal: true, inscricao: true, genero: 'F' },
      { nome: "Futsal 5x5 (Masculino)", isPrincipal: true, inscricao: true, genero: 'M' },
      
      // === ATUALIZAÇÃO "PREGIL" ===
      { nome: "Quadrado Feminino", inscricao: false, genero: 'F' },
      { nome: "Quadrado Masculino", inscricao: false, genero: 'M' },
      { nome: "Quadrado Misto", inscricao: false, genero: 'X' },
      { nome: "X1 Feminino", inscricao: false, genero: 'F' },
      { nome: "X1 Masculino", inscricao: false, genero: 'M' },
      { nome: "Futmesa (Todas)", inscricao: false, genero: 'X' },
      { nome: "Golzinho Street Fem", inscricao: false, genero: 'F' },
      { nome: "Golzinho Street Masc", inscricao: false, genero: 'M' },
    ]
  },
  // --- 2. VÔLEI (Grupo) ---
  {
    _id: 2,
    nome: 'Vôlei',
    slug: 'volei',
    imageUrl: '/images/volei.png', // <-- CAMINHO CORRIGIDO
    descricao: "Saques, bloqueios e cortadas...",
    linkEdital: "#VOLEI_GERAL_EDITAL",
    submodalidades: [
      { nome: "Vôlei de Quadra (Feminino)", isPrincipal: true, inscricao: true, genero: 'F' },
      { nome: "Vôlei de Quadra (Masculino)", isPrincipal: true, inscricao: true, genero: 'M' },
      
      // === ATUALIZAÇÃO "PREGIL" ===
      { nome: "Vôlei Quase de Praia Fem", inscricao: true, genero: 'F' },
      { nome: "Vôlei Quase de Praia Masc", inscricao: true, genero: 'M' },
      { nome: "Vôleimesa (Todas)", inscricao: false, genero: 'X' },
    ]
  },
  // --- 3. BASQUETE (Grupo) ---
  {
    _id: 3,
    nome: 'Basquete',
    slug: 'basquete',
    imageUrl: '/images/basquete.png', // <-- CAMINHO CORRIGIDO
    submodalidades: [
      { nome: "5x5 (Masculino)", isPrincipal: true, inscricao: true, genero: 'M' },
      { nome: "3x3 Feminino", inscricao: false, genero: 'F' },
      { nome: "3x3 Masculino", inscricao: false, genero: 'M' },
    ]
  },
  // --- 4. QUEIMADO (Simples) ---
  {
    _id: 4,
    nome: 'Queimado',
    slug: 'queimado',
    imageUrl: '/images/queimado.png', // <-- CAMINHO CORRIGIDO
    genero: 'X',
    submodalidades: []
  },
  // --- 5. TÊNIS DE MESA ---
  {
    _id: 5,
    nome: 'Tênis de Mesa',
    slug: 'tenis-de-mesa',
    imageUrl: '/images/pingpong.png', // <-- CAMINHO CORRIGIDO
    submodalidades: [
      { nome: "Individual Feminino", isPrincipal: true, inscricao: true, genero: 'F' },
      { nome: "Individual Masculino", isPrincipal: true, inscricao: true, genero: 'M' },
      { nome: "Dupla Mista", inscricao: false, genero: 'X' },
    ]
  },
  // --- 6. BADMINTON ---
  {
    _id: 6,
    nome: 'Badminton',
    slug: 'badminton',
    imageUrl: '/images/badminton.png', // <-- CAMINHO CORRIGIDO
    submodalidades: [
      { nome: "Dupla Feminina", inscricao: true, genero: 'F' },
      { nome: "Dupla Masculina", inscricao: true, genero: 'M' },
    ]
  },
  // --- 7. ATLETISMO ---
  {
    _id: 7,
    nome: 'Atletismo',
    slug: 'atletismo',
    imageUrl: '/images/atletismo.png', // <-- CAMINHO CORRIGIDO
    submodalidades: [
      { nome: "Revezamento 800m Quarteto (Fem)", isPrincipal: true, inscricao: true, genero: 'F' },
      { nome: "Revezamento 800m Quarteto (Masc)", isPrincipal: true, inscricao: true, genero: 'M' },
      { nome: "Corrida 100m Fem", inscricao: true, genero: 'F' },
      { nome: "Corrida 100m Masc", inscricao: true, genero: 'M' },
      { nome: "Corrida 200m Fem", inscricao: true, genero: 'F' },
      { nome: "Corrida 200m Masc", inscricao: true, genero: 'M' },
      { nome: "Corrida 800m Fem", inscricao: true, genero: 'F' },
      { nome: "Corrida 800m Masc", inscricao: true, genero: 'M' },
      { nome: "Corrida 1km Fem", inscricao: true, genero: 'F' },
      { nome: "Corrida 1km Masc", inscricao: true, genero: 'M' },
      { nome: "Arremesso de Peso Fem", inscricao: true, genero: 'F' },
      { nome: "Arremesso de Peso Masc", inscricao: true, genero: 'M' },
    ]
  },
  // --- 8. GINÁSTICA E LUTA ---
  {
    _id: 8,
    nome: 'Ginástica e Luta',
    slug: 'ginastica-luta',
    isAvulsoSimples: true,
    imageUrl: '/images/ginastica&calistenia.png', // <-- CAMINHO CORRIGIDO
    submodalidades: [
      { nome: "Calistenia Feminina", inscricao: true, genero: 'F' },
      { nome: "Calistenia Masculina", inscricao: true, genero: 'M' },
      { nome: "Karatê", inscricao: true, genero: 'X' },
      { nome: "Taekwondo", inscricao: true, genero: 'X', },
      { nome: "Judô", inscricao: true, genero: 'X', }
    ]
  },
  // --- 9. BOCHA ---
  {
    _id: 9,
    nome: 'Bocha',
    slug: 'bocha',
    imageUrl: '/images/bocha.png', // <-- CAMINHO CORRIGIDO
    genero: 'X',
    submodalidades: []
  },
  // --- 10. JOGOS DE TABULEIRO ---
  {
    _id: 10,
    nome: 'Jogos de Tabuleiro',
    slug: 'jogos-tabuleiro',
    isAvulsoSimples: true,
    imageUrl: '/images/Jogos de Tabuleiro.png', // <-- CAMINHO CORRIGIDO
    submodalidades: [
      { nome: "UNO", inscricao: true, genero: 'X' },
      { nome: "Dama", inscricao: true, genero: 'X' },
      { nome: "Dominó", inscricao: true, genero: 'X' },
      { nome: "Xadrez Iniciante", inscricao: true, genero: 'X' },
      { nome: "Xadrez Intermediário", inscricao: true, genero: 'X' },
    ]
  },
  // --- 11. JOGOS MATEMÁTICOS ---
  {
    _id: 11,
    nome: 'Jogos Matemáticos',
    slug: 'jogos-matematicos',
    isAvulsoSimples: true,
    imageUrl: '/images/Jogos Matemáticos.png', // <-- CAMINHO CORRIGIDO
    submodalidades: [
      { nome: "Cubo Mágico 3x3 Iniciante", inscricao: true, genero: 'X' },
      { nome: "Cubo Mágico 3x3 Intermediário", inscricao: true, genero: 'X' },
      { nome: "Cubo Mágico 3x3 Avançado", inscricao: true, genero: 'X' },
      { nome: "Cubo Mágico 2x2", inscricao: true, genero: 'X' },
      { nome: "Sudoku", inscricao: true, genero: 'X' },
    ]
  },
  // --- 12. JOGOS DIGITAIS ---
  {
    _id: 12,
    nome: 'Jogos Digitais',
    slug: 'jogos-digitais',
    imageUrl: '/images/Jogos Digitais.png', // <-- CAMINHO CORRIGIDO
    submodalidades: [
      { nome: "Free Fire Mapa Aberto", isPrincipal: true, inscricao: true, genero: 'X' },
      { nome: "Call of Duty Equipe", isPrincipal: true, inscricao: true, genero: 'X' },
      { nome: "FIFA X1", isPrincipal: true, inscricao: true, genero: 'X' },
      { nome: "Free Fire 4x4", inscricao: true, genero: 'X' },
      { nome: "Free Fire X1", inscricao: true, genero: 'X' },
      { nome: "Call of Duty Individual", inscricao: true, genero: 'X' },
      { nome: "FIFA 2v2", inscricao: true, genero: 'X' },
      { nome: "Clash Royale", inscricao: true, genero: 'X' },
      { nome: "Just Dance", inscricao: true, genero: 'X' },
      { nome: "Mortal Kombat", inscricao: true, genero: 'X' },
      { nome: "League of Legends (Mobile)", inscricao: true, genero: 'X' },
      { nome: "Brawl Stars", inscricao: true, genero: 'X' },
    ]
  },
  // --- 13. JOGOS DE IMAGINAÇÃO ---
  {
    _id: 13,
    nome: 'Jogos de Imaginação',
    slug: 'jogos-imaginacao',
    isAvulsoSimples: true,
    imageUrl: '/images/Jogos de Imaginação.png', // <-- CAMINHO CORRIGIDO
    submodalidades: [
      { nome: "RPG", isPrincipal: true, inscricao: true, genero: 'X' },
      { nome: "RPG PVP", inscricao: true, genero: 'X' },
      { nome: "Card Game", inscricao: true, genero: 'X' },
      { nome: "Cosplay", inscricao: true, genero: 'X' },
    ]
  },
];

// Exporta para o 'seed.js' ler
module.exports = { modalidades };