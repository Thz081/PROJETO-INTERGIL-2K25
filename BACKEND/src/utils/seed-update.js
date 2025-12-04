const dotenv = require('dotenv');
const connectDB = require('../config/db.js');
const Modalidade = require('../models/modalidade.model.js');

dotenv.config();

const updateModalidades = async () => {
  try {
    await connectDB();
    console.log("Conectado ao Banco...");

    // 1. Acha a modalidade "Ginástica e Luta"
    const modalidadeAlvo = await Modalidade.findOne({ slug: 'ginastica-luta' }); // Confirme se o slug no banco é esse ou 'ginastica-e-luta'

    if (!modalidadeAlvo) {
      console.log("Modalidade 'Ginástica e Luta' não encontrada!");
      process.exit(1);
    }

    // 2. Define as novas subs (SEXO X - EXATAMENTE COMO NO SEU DATA)
    const novasSubs = [
      {
        nome: "Taekwondo",
        isPrincipal: false,
        genero: "X", // <--- MISTO
        inscricao: true,
        edital: "#",
        chaveamento: "#"
      },
      {
        nome: "Judô",
        isPrincipal: false,
        genero: "X", // <--- MISTO
        inscricao: true,
        edital: "#",
        chaveamento: "#"
      }
    ];

    // 3. Adiciona as novas subs (Evitando duplicatas)
    const nomesAtuais = modalidadeAlvo.submodalidades.map(s => s.nome);
    
    let adicionadas = 0;
    novasSubs.forEach(sub => {
        if (!nomesAtuais.includes(sub.nome)) {
            modalidadeAlvo.submodalidades.push(sub);
            adicionadas++;
        }
    });

    // 4. Salva
    await modalidadeAlvo.save();
    console.log(`SUCESSO: ${adicionadas} novas submodalidades (Tipo X) adicionadas!`);
    
    process.exit();

  } catch (error) {
    console.error(`ERRO: ${error}`);
    process.exit(1);
  }
};

updateModalidades();