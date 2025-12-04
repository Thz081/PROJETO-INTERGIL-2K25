// Arquivo: InterDoZero/src/data/salasData.js
// VERSÃO 2.0 - LISTA COMPLETA (12 Salas) e CAMINHOS CORRIGIDOS

// (Sem 'export const', apenas 'const' para o 'require' funcionar)
const fakeSalas = [
  {
    nome: 'SPARTTA',
    logo_url: '/images/sala 1.png', // Caminho corrigido
    turma: '1°a A ADM',
    instagram: ' https://www.instagram.com/1a.adm/',
    pontos: 0,
  },
  {
    nome: 'ELECTRA',
    logo_url: '/images/sala 2.png',
    turma: '1° B ADM',
    instagram: ' https://www.instagram.com/_1badm/',
    pontos: 0,
  },
  {
    nome: 'ARCANIA',
    logo_url: '/images/sala 3.png',
    turma: '1° A DS',
    instagram: 'https://www.instagram.com/1adsistemas_/',
    pontos: 0,
  },
  {
    nome: 'VALHALLA',
    logo_url: '/images/sala 4.png',
    turma: '1° B DS',
    instagram: 'https://www.instagram.com/1bdsistemas/',
    pontos: 0,
  },
  {
    nome: 'MONARCAS',
    logo_url: '/images/sala 5.png',
    turma: '2° A DS',
    instagram: 'https://www.instagram.com/2adsistemas_/',
    pontos: 10000, // Mantive os pontos do teste!
  },
  {
    nome: 'ARDHARIA',
    logo_url: '/images/sala 6.png',
    turma: '2° B DS',
    instagram: 'https://www.instagram.com/2b.dsistemas/',
    pontos: 0,
  },
  {
    nome: 'MIDGARD',
    logo_url: '/images/sala 7.png',
    turma: '2° A ADM',
    instagram: 'https://www.instagram.com/2aadm__/',
    pontos: 0,
  },
  {
    nome: 'ATLANTIS',
    logo_url: '/images/sala 8.png',
    turma: '2° B ADM',
    instagram: 'https://www.instagram.com/2b.admx/',
    pontos: 0,
  },
  {
    nome: 'IMPERIAIS',
    logo_url: '/images/sala 9.png',
    turma: '3° A DS',
    instagram: 'https://www.instagram.com/3adsistemaas/',
    pontos: 0,
  },
  {
    nome: 'ALATARES',
    logo_url: '/images/sala 10.png',
    turma: '3° B DS',
    instagram: 'https://www.instagram.com/3bdsistemas/',
    pontos: 0,
  },
  {
    nome: 'HUNTERS',
    logo_url: '/images/sala 11.png',
    turma: '3° A ADM',
    instagram: 'https://www.instagram.com/3aadm.rx/',
    pontos: 0,
  },
  {
    nome: 'EXTREME',
    logo_url: '/images/sala 12.png',
    turma: '3° B ADM',
    instagram: 'https://www.instagram.com/_3badm/',
    pontos: 0,
  },
];

// Exporta para o 'seed.js' ler
module.exports = { fakeSalas };