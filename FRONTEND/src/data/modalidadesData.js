// ===============================================
// === IMPORTANDO SUAS IMAGENS (A LISTA COMPLETA) ===
// ===============================================
import imgFutsal from '../assets/images/futsal.png';
import imgVolei from '../assets/images/volei.png';
import imgBasquete from '../assets/images/basquete.png';
import imgQueimado from '../assets/images/queimado.png';
import imgTenisMesa from '../assets/images/pingpong.png';
import imgBadminton from '../assets/images/badminton.png';
import imgAtletismo from '../assets/images/atletismo.png';
import imgGinasticaLuta from '../assets/images/ginastica&calistenia.png';
import imgBocha from '../assets/images/bocha.png';
import imgJogosTabuleiro from '../assets/images/Jogos de Tabuleiro.png';
import imgJogosMatematicos from '../assets/images/Jogos Matemáticos.png';
import imgJogosDigitais from '../assets/images/Jogos Digitais.png';
import imgJogosImaginacao from '../assets/images/Jogos de Imaginação.png';


// ===============================================
// === A ESTRUTURA FINAL (v1.2 com a FLAG 'isAvulsoSimples') ===
// ===============================================
export const modalidades = [
  // --- 1. JOGOS DE QUADRA (FUTSAL) ---
  // (Lógica da Eli padrão: isPrincipal + 2 grátis)
  {
    _id: 1,
    nome: 'Futsal',
    slug: 'futsal',
    imageUrl: imgFutsal,
    descricao: "O Futsal do Intergil é pura emoção...",
    linkEdital: "#FUTSAL_GERAL_EDITAL",
    submodalidades: [
      { nome: "Futsal 5x5 (Feminino)", isPrincipal: true, inscricao: true, genero: 'F', edital: "#FUTSAL_FEM_EDITAL", chaveamento: "#FUTSAL_FEM_CHAVE" },
      { nome: "Futsal 5x5 (Masculino)", isPrincipal: true, inscricao: true, genero: 'M', edital: "#FUTSAL_MASC_EDITAL", chaveamento: "#FUTSAL_MASC_CHAVE" },
      // Subs "Grátis"
      { nome: "Quadrado Feminino", inscricao: true, genero: 'F', edital: "#QUAD_FEM_EDITAL", chaveamento: "#QUAD_FEM_CHAVE" },
      { nome: "Quadrado Masculino", inscricao: true, genero: 'M', edital: "#QUAD_MASC_EDITAL", chaveamento: "#QUAD_MASC_CHAVE" },
      { nome: "Quadrado Misto", inscricao: true, genero: 'X', edital: "#QUAD_MISTO_EDITAL", chaveamento: "#QUAD_MISTO_CHAVE" },
      // Subs do Pregil (não aparecem na inscrição)
      { nome: "X1 Feminino", inscricao: false, genero: 'F' },
      { nome: "X1 Masculino", inscricao: false, genero: 'M' },
      { nome: "Futmesa (Todas)", inscricao: false, genero: 'X' },
      { nome: "Golzinho Street Fem", inscricao: false, genero: 'F' },
      { nome: "Golzinho Street Masc", inscricao: false, genero: 'M' },
    ]
  },
  // --- 2. JOGOS DE QUADRA (VÔLEI) ---
  // (Lógica da Eli padrão: isPrincipal + 2 grátis)
  {
    _id: 2,
    nome: 'Vôlei',
    slug: 'volei',
    imageUrl: imgVolei,
    descricao: "Saques, bloqueios e cortadas de tirar o fôlego...",
    linkEdital: "#VOLEI_GERAL_EDITAL",
    submodalidades: [
      { nome: "Vôlei de Quadra (Feminino)", isPrincipal: true, inscricao: true, genero: 'F', edital: "#VOLEI_QUADRA_FEM_EDITAL", chaveamento: "#VOLEI_QUADRA_FEM_CHAVE" },
      { nome: "Vôlei de Quadra (Masculino)", isPrincipal: true, inscricao: true, genero: 'M', edital: "#VOLEI_QUADRA_MASC_EDITAL", chaveamento: "#VOLEI_QUADRA_MASC_CHAVE" },
      { nome: "Vôlei Quase de Praia Fem", inscricao: true, genero: 'F', edital: "#VOLEIPRAIA_FEM_EDITAL", chaveamento: "#VOLEIPRAIA_FEM_CHAVE" },
      { nome: "Vôlei Quase de Praia Masc", inscricao: true, genero: 'M', edital: "#VOLEIPRAIA_MASC_EDITAL", chaveamento: "#VOLEIPRAIA_MASC_CHAVE" },
      { nome: "Vôleimesa (Todas)", inscricao: false, genero: 'X' },
    ]
  },
  // --- 3. JOGOS DE QUADRA (BASQUETE) ---
  // (Lógica da Eli padrão: Apenas isPrincipal, sem grátis)
  {
    _id: 3,
    nome: 'Basquete',
    slug: 'basquete',
    imageUrl: imgBasquete,
    descricao: "Dribles, enterradas e cestas de 3 pontos...",
    linkEdital: "#BASQUETE_GERAL_EDITAL",
    submodalidades: [
      { nome: "5x5 (Masculino)", isPrincipal: true, inscricao: true, genero: 'M', edital: "#5X5_MASC_EDITAL", chaveamento: "#5X5_MASC_CHAVE" },
      { nome: "3x3 Feminino", inscricao: false, genero: 'F' },
      { nome: "3x3 Masculino", inscricao: false, genero: 'M' },
    ]
  },
  // --- 4. JOGOS DE QUADRA (QUEIMADO) ---
  // (Lógica Simples: submodalidades: [])
  {
    _id: 4,
    nome: 'Queimado',
    slug: 'queimado',
    imageUrl: imgQueimado,
    descricao: "O clássico das quadras da escola...",
    linkEdital: "#QUEIMADO_EDITAL",
    linkChaveamento: "#QUEIMADO_CHAVE",
    genero: 'X',
    submodalidades: [] // Array vazio = Modalidade Simples
  },
  // --- 5. TÊNIS DE MESA ---
  // (Lógica da Eli padrão: isPrincipal + 1 grátis)
  {
    _id: 5,
    nome: 'Tênis de Mesa',
    slug: 'tenis-de-mesa',
    imageUrl: imgTenisMesa,
    descricao: "Velocidade e precisão na raquete...",
    linkEdital: "#TENISMESA_GERAL_EDITAL",
    submodalidades: [
      { nome: "Individual Feminino", isPrincipal: true, inscricao: true, genero: 'F', edital: "#TM_IND_FEM_EDITAL", chaveamento: "#TM_IND_FEM_CHAVE" },
      { nome: "Individual Masculino", isPrincipal: true, inscricao: true, genero: 'M', edital: "#TM_IND_MASC_EDITAL", chaveamento: "#TM_IND_MASC_CHAVE" },
      // Sub "grátis"
      { nome: "Dupla Mista", inscricao: false, genero: 'X', edital: "#TM_DUPLA_MISTA_EDITAL", chaveamento: "#TM_DUPLA_MISTA_CHAVE" },
    ]
  },
  // --- 6. BADMINTON ---
  // (Lógica Avulsa v1.1: Sem isPrincipal, limitado a 2 subs)
  {
    _id: 6,
    nome: 'Badminton',
    slug: 'badminton',
    imageUrl: imgBadminton,
    descricao: "Agilidade e estratégia com a peteca...",
    linkEdital: "#BADMINTON_GERAL_EDITAL",
    submodalidades: [
      { nome: "Dupla Feminina", inscricao: true, genero: 'F', edital: "#BAD_DUPLA_FEM_EDITAL", chaveamento: "#BAD_DUPLA_FEM_CHAVE" },
      { nome: "Dupla Masculina", inscricao: true, genero: 'M', edital: "#BAD_DUPLA_MASC_EDITAL", chaveamento: "#BAD_DUPLA_MASC_CHAVE" },
    ]
  },
  // --- 7. ATLETISMO ---
  // (Lógica da Eli padrão: isPrincipal + 2 grátis)
  {
    _id: 7,
    nome: 'Atletismo',
    slug: 'atletismo',
    imageUrl: imgAtletismo,
    descricao: "Superando limites na pista e no campo...",
    linkEdital: "#ATLETISMO_GERAL_EDITAL",
    submodalidades: [
      { nome: "Revezamento 800m Quarteto (Fem)", isPrincipal: true, inscricao: true, genero: 'F', edital: "#REV800M_FEM_EDITAL", chaveamento: "#REV800M_FEM_RESULTADOS" },
      { nome: "Revezamento 800m Quarteto (Masc)", isPrincipal: true, inscricao: true, genero: 'M', edital: "#REV800M_MASC_EDITAL", chaveamento: "#REV800M_MASC_RESULTADOS" },
      // Subs (limite de 2 grátis se pegar revezamento)
      { nome: "Corrida 100m Fem", inscricao: true, genero: 'F', edital: "#100M_FEM_EDITAL", chaveamento: "#100M_FEM_RESULTADOS" },
      { nome: "Corrida 100m Masc", inscricao: true, genero: 'M', edital: "#100M_MASC_EDITAL", chaveamento: "#100M_MASC_RESULTADOS" },
      { nome: "Corrida 200m Fem", inscricao: true, genero: 'F', edital: "#200M_FEM_EDITAL", chaveamento: "#200M_FEM_RESULTADOS" },
      { nome: "Corrida 200m Masc", inscricao: true, genero: 'M', edital: "#200M_MASC_EDITAL", chaveamento: "#200M_MASC_RESULTADOS" },
      { nome: "Corrida 800m Fem", inscricao: true, genero: 'F', edital: "#800M_FEM_EDITAL", chaveamento: "#800M_FEM_RESULTADOS" },
      { nome: "Corrida 800m Masc", inscricao: true, genero: 'M', edital: "#800M_MASC_EDITAL", chaveamento: "#800M_MASC_RESULTADOS" },
      { nome: "Corrida 1km Fem", inscricao: true, genero: 'F', edital: "#1KM_FEM_EDITAL", chaveamento: "#1KM_FEM_RESULTADOS" },
      { nome: "Corrida 1km Masc", inscricao: true, genero: 'M', edital: "#1KM_MASC_EDITAL", chaveamento: "#1KM_MASC_RESULTADOS" },
      { nome: "Arremesso de Peso Fem", inscricao: true, genero: 'F', edital: "#PESO_FEM_EDITAL", chaveamento: "#PESO_FEM_RESULTADOS" },
      { nome: "Arremesso de Peso Masc", inscricao: true, genero: 'M', edital: "#PESO_MASC_EDITAL", chaveamento: "#PESO_MASC_RESULTADOS" },
    ]
  },
  // --- 8. GINÁSTICA E LUTA ---
  // (NOVA LÓGICA: Exceção! Todas as subs são avulsas simples, custam 1)
  {
    _id: 8,
    nome: 'Ginástica e Luta',
    slug: 'ginastica-luta',
    isAvulsoSimples: true, // <-- FLAG DE EXCEÇÃO ADICIONADA
    imageUrl: imgGinasticaLuta,
    descricao: "Força, flexibilidade e disciplina...",
    linkEdital: "#GINASTICALUTA_GERAL_EDITAL",
    submodalidades: [
      { nome: "Calistenia Feminina", inscricao: true, genero: 'F', edital: "#CALIST_FEM_EDITAL", chaveamento: "#CALIST_FEM_APRESENTACAO" },
      { nome: "Calistenia Masculina", inscricao: true, genero: 'M', edital: "#CALIST_MASC_EDITAL", chaveamento: "#CALIST_MASC_APRESENTACAO" },
      { nome: "Karatê", inscricao: true, genero: 'X', edital: "#KARATE_EDITAL", chaveamento: "#KARATE_CHAVE" },
       { nome: "Taekwondo", inscricao: true, genero: 'X', edital: "#TAEKWONDO_EDITAL", chaveamento: "#TAEKWONDO_CHAVE" },
        { nome: "Judô", inscricao: true, genero: 'X', edital: "#JUDÔ_EDITAL", chaveamento: "#JUDÔ_CHAVE" },
    ]
  },
  // --- 9. BOCHA ---
  // (Lógica Simples: submodalidades: [])
  {
    _id: 9,
    nome: 'Bocha',
    slug: 'bocha',
    imageUrl: imgBocha,
    descricao: "Precisão e estratégia no lançamento...",
    linkEdital: "#BOCHA_EDITAL",
    linkChaveamento: "#BOCHA_CHAVE",
    genero: 'X',
    submodalidades: []
  },
  // --- 10. JOGOS DE TABULEIRO ---
  // (NOVA LÓGICA: Exceção! Todas as subs são avulsas simples, custam 1)
  {
    _id: 10,
    nome: 'Jogos de Tabuleiro',
    slug: 'jogos-tabuleiro',
    isAvulsoSimples: true, // <-- FLAG DE EXCEÇÃO ADICIONADA
    imageUrl: imgJogosTabuleiro,
    descricao: "Raciocínio e diversão na mesa...",
    linkEdital: "#TABULEIRO_GERAL_EDITAL",
    submodalidades: [
      { nome: "UNO", inscricao: true, genero: 'X', edital: "#UNO_EDITAL", chaveamento: "#UNO_CHAVE" },
      { nome: "Dama", inscricao: true, genero: 'X', edital: "#DAMA_EDITAL", chaveamento: "#DAMA_CHAVE" },
      { nome: "Dominó", inscricao: true, genero: 'X', edital: "#DOMINO_EDITAL", chaveamento: "#DOMINO_CHAVE" },
      { nome: "Xadrez Iniciante", inscricao: true, genero: 'X', edital: "#XADREZ_INI_EDITAL", chaveamento: "#XADREZ_INI_CHAVE" },
      { nome: "Xadrez Intermediário", inscricao: true, genero: 'X', edital: "#XADREZ_INT_EDITAL", chaveamento: "#XADREZ_INT_CHAVE" },
    ]
  },
  // --- 11. JOGOS MATEMÁTICOS ---
  // (NOVA LÓGICA: Exceção! Todas as subs são avulsas simples, custam 1)
  {
    _id: 11,
    nome: 'Jogos Matemáticos',
    slug: 'jogos-matematicos',
    isAvulsoSimples: true, // <-- FLAG DE EXCEÇÃO ADICIONADA
    imageUrl: imgJogosMatematicos,
    descricao: "Desafie sua lógica e velocidade...",
    linkEdital: "#MATEMATICOS_GERAL_EDITAL",
    submodalidades: [
      { nome: "Cubo Mágico 3x3 Iniciante", inscricao: true, genero: 'X', edital: "#CUBO3X3_INI_EDITAL", chaveamento: "#CUBO3X3_INI_RESULTADOS" },
      { nome: "Cubo Mágico 3x3 Intermediário", inscricao: true, genero: 'X', edital: "#CUBO3X3_INT_EDITAL", chaveamento: "#CUBO3X3_INT_RESULTADOS" },
      { nome: "Cubo Mágico 3x3 Avançado", inscricao: true, genero: 'X', edital: "#CUBO3X3_AVAN_EDITAL", chaveamento: "#CUBO3X3_AVAN_RESULTADOS" },
      { nome: "Cubo Mágico 2x2", inscricao: true, genero: 'X', edital: "#CUBO2X2_EDITAL", chaveamento: "#CUBO2X2_RESULTADOS" },
      { nome: "Sudoku", inscricao: true, genero: 'X', edital: "#SUDOKU_EDITAL", chaveamento: "#SUDOKU_RESULTADOS" },
    ]
  },
  // --- 12. JOGOS DIGITAIS ---
  // (Lógica da Eli Híbrida: Vários isPrincipal + grátis + avulsas)
  {
    _id: 12,
    nome: 'Jogos Digitais',
    slug: 'jogos-digitais',
    imageUrl: imgJogosDigitais,
    descricao: "A competição vai para o virtual!",
    linkEdital: "#DIGITAIS_GERAL_EDITAL",
    submodalidades: [
      // Principais
      { nome: "Free Fire Mapa Aberto", isPrincipal: true, inscricao: true, genero: 'X', edital: "#FFMAPA_EDITAL", chaveamento: "#FFMAPA_CHAVE" },
      { nome: "Call of Duty Equipe", isPrincipal: true, inscricao: true, genero: 'X', edital: "#COD_EQP_EDITAL", chaveamento: "#COD_EQP_CHAVE" },
      { nome: "FIFA X1", isPrincipal: true, inscricao: true, genero: 'X', edital: "#FIFA_X1_EDITAL", chaveamento: "#FIFA_X1_CHAVE" },

      // Subs "grátis" do Free Fire
      { nome: "Free Fire 4x4", inscricao: true, genero: 'X', edital: "#FF4X4_EDITAL", chaveamento: "#FF4X4_CHAVE" },
      { nome: "Free Fire X1", inscricao: true, genero: 'X', edital: "#FFX1_EDITAL", chaveamento: "#FFX1_CHAVE" },
      // Sub "grátis" do CoD
      { nome: "Call of Duty Individual", inscricao: true, genero: 'X', edital: "#COD_IND_EDITAL", chaveamento: "#COD_IND_CHAVE" },
      // Sub "grátis" do FIFA
      { nome: "FIFA 2v2", inscricao: true, genero: 'X', edital: "#FIFA_2V2_EDITAL", chaveamento: "#FIFA_2V2_CHAVE" },

      // O resto é avulso (limitado a 2 pela regra v1.1)
      { nome: "Clash Royale", inscricao: true, genero: 'X', edital: "#CLASH_EDITAL", chaveamento: "#CLASH_CHAVE" },
      { nome: "Just Dance", inscricao: true, genero: 'X', edital: "#JUSTDANCE_EDITAL", chaveamento: "#JUSTDANCE_PONTUACAO" },
      { nome: "Mortal Kombat", inscricao: true, genero: 'X', edital: "#MK_EDITAL", chaveamento: "#MK_CHAVE" },
      { nome: "League of Legends (Mobile)", inscricao: true, genero: 'X', edital: "#LOLMOBILE_EDITAL", chaveamento: "#LOLMOBILE_CHAVE" },
      { nome: "Brawl Stars", inscricao: true, genero: 'X', edital: "#BRAWL_EDITAL", chaveamento: "#BRAWL_CHAVE" },
    ]
  },
  // --- 13. JOGOS DE IMAGINAÇÃO ---
  // (NOVA LÓGICA: Exceção! Todas as subs são avulsas simples, custam 1)
  {
    _id: 13,
    nome: 'Jogos de Imaginação',
    slug: 'jogos-imaginacao',
    isAvulsoSimples: true, // <-- FLAG DE EXCEÇÃO ADICIONADA
    imageUrl: imgJogosImaginacao,
    descricao: "Criatividade e interpretação em jogo...",
    linkEdital: "#IMAGINACAO_GERAL_EDITAL",
    submodalidades: [
      // O 'isPrincipal' aqui será ignorado pelo Inscricao.js v1.2,
      // porque 'isAvulsoSimples' tem prioridade.
      { nome: "RPG", isPrincipal: true, inscricao: true, genero: 'X', edital: "#RPG_EDITAL", chaveamento: "#RPG_MESAS" },
      { nome: "RPG PVP", inscricao: true, genero: 'X', edital: "#RPGPVP_EDITAL", chaveamento: "#RPGPVP_CHAVE" },
      { nome: "Card Game", inscricao: true, genero: 'X', edital: "#CARDGAME_EDITAL", chaveamento: "#CARDGAME_TORNEIO" },
      { nome: "Cosplay", inscricao: true, genero: 'X', edital: "#COSPLAY_EDITAL", chaveamento: "#COSPLAY_APRESENTACAO" },
    ]
  },
];