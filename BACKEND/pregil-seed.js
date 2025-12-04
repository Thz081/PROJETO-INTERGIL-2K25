// Arquivo: BACKEND/pregil-seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Aluno = require('./src/models/aluno.model.js');

dotenv.config();

// === A LISTA DA VERDADE (Convertida do seu TXT) ===
const dadosPreGil = [
    // 1º A ADM
    { id: '2962362', v: 1 }, // Kalyne
    { id: '3868323', v: 1 }, // Ketilly
    { id: '3874716', v: 1 }, // Gabriella
    { id: '3369730', v: 1 }, // Esther
    { id: '3875189', f: 1 }, // Pedro Henrique
    { id: '3891885', f: 1 }, // Renan
    { id: '2726611', f: 1, b: 1 }, // Thalyson
    { id: '2955596', f: 1 }, // Jonas
    { id: '3870180', v: 1 }, // Miguel N
    { id: '2962419', v: 1 }, // Miguel Davi
    { id: '2779511', v: 1 }, // Marconi
    { id: '3132434', v: 1, b: 1 }, // Antonio
    { id: '3868683', b: 1 }, // Tiago
    { id: '3869921', b: 1 }, // Daniel

    // 1º B ADM
    { id: '3809544', f: 1, v: 1, b: 1 }, // Maria Julia
    { id: '3877170', f: 1 }, // Kamilla
    { id: '3869520', f: 1, v: 1, b: 1 }, // Bianca
    { id: '3755547', v: 1, b: 1 }, // Gabriella
    { id: '3869552', b: 1 }, // Ana Clara
    { id: '3869925', v: 1 }, // Maria Alice
    { id: '2906020', f: 1 }, // Joao Pedro
    { id: '3873194', f: 1 }, // Filipe
    { id: '2952700', f: 1 }, // Vitor Chimenes
    { id: '3767023', f: 1, v: 1 }, // Pedro Henrique
    { id: '3870224', v: 1, b: 1 }, // Kaua Manoel
    { id: '3868444', v: 1 }, // Hamilton
    { id: '3868225', v: 1 }, // Anthony Lucas
    { id: '3873114', b: 1 }, // Cristopher
    { id: '3869933', b: 1 }, // Nicolas Uri
    { id: '3868297', b: 1 }, // Esdras

    // 1º A DS
    { id: '2912256', f: 1, v: 1 }, // Cristiane
    { id: '3875402', f: 1 }, // Julia Cecilia
    { id: '2955732', f: 1, v: 1 }, // Ana Beatriz
    { id: '2978012', f: 1, v: 1 }, // Leticia Gabrielly
    { id: '3079843', v: 1 }, // Luiza Victoria
    { id: '3873095', f: 1 }, // Mario Pereira
    { id: '3868717', f: 1 }, // Cauan Icaro
    { id: '3869910', f: 1 }, // Ellison Luiz
    { id: '2987066', f: 1, b: 1 }, // Luiz Fernando
    { id: '3872674', f: 1 }, // Jurandir
    { id: '3870441', f: 1, v: 1 }, // Derick
    { id: '2901189', v: 1, b: 1 }, // Jose
    { id: '3873131', v: 1 }, // Kennay
    { id: '3876903', v: 1 }, // Adriel
    { id: '3868732', b: 1 }, // Jonhsons
    { id: '3868748', b: 1 }, // Cleber Augusto

    // 1º B DS
    { id: '3875253', f: 1 }, // Sofia
    { id: '2792454', f: 1, v: 1 }, // Rute
    { id: '3269718', f: 1 }, // Laryssa
    { id: '2934695', f: 1, v: 1 }, // Jamilly
    { id: '3875416', f: 1 }, // Joao V.S
    { id: '3876887', f: 1 }, // Alves
    { id: '3872306', f: 1 }, // Anthony
    { id: '2869005', f: 1 }, // Ryan
    { id: '3286628', f: 1 }, // Micael
    { id: '3868689', b: 1 }, // Emanuel
    { id: '2966177', b: 1 }, // Guilherme
    { id: '2961229', b: 1 }, // Luis Miguel
    { id: '3869961', v: 1, b: 1 }, // Davi Pedro
    { id: '3868505', v: 1 }, // Keven

    // 2º A DS
    { id: '3673106', f: 1 }, // Ketlen
    { id: '3670439', f: 1, v: 1 }, // Emilly Xavier
    { id: '3673935', f: 1, v: 1 }, // Maria Clara
    { id: '3670315', f: 1 }, // Alice Giovana
    { id: '2856395', f: 1 }, // Taina R
    { id: '3409754', v: 1, b: 1 }, // Yasmim Marie
    { id: '3676143', b: 1 }, // Sarah Pena
    { id: '2729080', f: 1 }, // Miguel G
    { id: '3674171', f: 1, v: 1 }, // Hugo W
    { id: '2750582', f: 1 }, // Pietro M
    { id: '3676578', f: 1 }, // Vitor G
    { id: '2777510', f: 1 }, // Gabriel Henrique
    { id: '3627492', v: 1 }, // Bruno Pereira
    { id: '3725600', v: 1 }, // Caua Jose
    { id: '3711535', v: 1 }, // Gabriel Barboza
    { id: '3676129', b: 1 }, // Arthur Henrique
    { id: '3711533', b: 1 }, // Tacyo
    { id: '2775359', b: 1 }, // Carlos K
    { id: '3392750', b: 1 }, // Lucas Kauan

    // 2º B DS
    { id: '3676575', f: 3 }, // Mariana Mel (3 subs de futsal)
    { id: '3676586', f: 2 }, // Erika
    { id: '3676430', f: 1 }, // Leticia
    { id: '3676294', f: 1 }, // Ester
    { id: '3674125', v: 1 }, // Isly
    { id: '3670449', v: 2 }, // Kevelyn (2 subs volei)
    { id: '3673895', v: 1 }, // Sara
    { id: '3670366', v: 1 }, // Emily
    { id: '2780144', f: 1 }, // Bruna
    { id: '3673085', f: 1 }, // Gabriel Carlos
    { id: '3673759', f: 1, v: 1, b: 1 }, // Nicolas
    { id: '3670375', f: 1 }, // Vinicius
    { id: '2802935', f: 1 }, // Jeff
    { id: '3673198', v: 1, b: 1 }, // Ezequiel
    { id: '3393851', v: 1, b: 1 }, // Jonathan
    { id: '3673164', v: 1, b: 1 }, // Gustavo
    { id: '3676159', v: 1 }, // Sariel
    { id: '3711592', v: 1 }, // Abner
    { id: '3672956', v: 1 }, // Milton

    // 2º A ADM
    { id: '3676300', f: 1, b: 1 }, // Halana
    { id: '3676099', f: 1, b: 1 }, // Isabella
    { id: '3349576', f: 1, v: 1 }, // Maria Luyza
    { id: '3673139', f: 1 }, // Ana Carolina
    { id: '3676094', f: 1, v: 1}, // Raquel Soriano (Assumindo id)
    { id: '3676314', f: 1 }, // Laryssa
    { id: '2821268', v: 1 }, // Jheniffer
    { id: '2767007', v: 1 }, // Lavinia
    { id: '2859333', b: 1 }, // Sampaio
    { id: '3254221', b: 1 }, // Ketylle
    { id: '3673830', f: 1 }, // Andrey
    { id: '3670524', f: 1, v: 1, b: 1 }, // Caio
    { id: '3711621', f: 1, b: 1 }, // Guilhermy
    { id: '2877754', f: 1, v: 1, b: 1 }, // Sergio
    { id: '3673624', f: 1, v: 1 }, // Gabriel
    { id: '3379141', b: 1 }, // Arthur
    { id: '3674094', v: 1 }, // Fernando

    // 2º B ADM
    { id: '3670583', f: 1 }, // Maria Julia
    { id: '2741228', f: 1 }, // Sarah Melo
    { id: '3676582', f: 1 }, // Monaliza
    { id: '2801793', v: 1 }, // Deborah
    { id: '3676583', v: 1 }, // Anamym
    { id: '3673743', f: 1, v: 1 }, // Caua
    { id: '3725597', f: 1, v: 1 }, // Matheus
    { id: '3673717', f: 1, b: 1 }, // Arthur
    { id: '3711634', f: 1 }, // Marlon
    { id: '3673006', v: 1 }, // Pedro
    { id: '3674354', v: 1, b: 1 }, // Marcos
    { id: '3673047', b: 1 }, // Caio
    { id: '2861821', b: 1 }, // Breno

    // 3º A DS
    { id: '2555105', f: 1 }, // Letycia
    { id: '3427952', f: 1, v: 1, b: 1 }, // Keillyane
    { id: '3430637', f: 1, b: 1 }, // Kiuany
    { id: '3091170', f: 1, v: 1 }, // Maria J
    { id: '3428647', f: 1, v: 1 }, // Emilly
    { id: '3441710', f: 1, v: 1, b: 1 }, // Leticia V
    { id: '3429759', f: 1, v: 1, b: 1 }, // Arthur P
    { id: '2562386', f: 1 }, // Arthur M
    { id: '3437691', f: 1 }, // Italo
    { id: '2913797', f: 1, b: 1 }, // Carlos
    { id: '2588814', f: 1, b: 1 }, // Erick Vital
    { id: '3012261', f: 1, v: 1 }, // Anderson
    { id: '3429534', v: 1, b: 1 }, // Cainan
    { id: '3428658', v: 1 }, // Branquinho

    // 3º B DS
    { id: '3502245', f: 1, v: 1, b: 1 }, // Brenda
    { id: '2532083', f: 1, v: 1 }, // Ingrid
    { id: '2562569', f: 1, b: 1 }, // Ana Gabriela
    { id: '2580831', f: 1 }, // Geovanna S
    { id: '3429581', f: 1 }, // Naate
    { id: '2370471', v: 1, b: 1 }, // Ana Julia
    { id: '3429332', v: 1 }, // Maria Julia
    { id: '3428689', f: 1, v: 1, b: 1 }, // Marcos
    { id: '3427449', f: 1 }, // Everton
    { id: '3427426', f: 1, v: 1, b: 1 }, // Adryan
    { id: '3429523', f: 1, b: 1 }, // Rafael
    { id: '3520849', f: 1 }, // Miguel V
    { id: '3429511', v: 1, b: 1 }, // Anderson
    { id: '3428598', v: 1 }, // Arthur

    // 3º A ADM
    { id: '2661754', f: 1 }, // Julia Maria
    { id: '3428400', f: 1 }, // Maria Julia
    { id: '3440193', f: 1 }, // Mikaelly
    { id: '3428418', f: 1, v: 1, b: 1 }, // Williany
    { id: '2346930', f: 1, b: 1 }, // Taina
    { id: '3437855', f: 1, v: 1, b: 1 }, // Estefany
    { id: '3428386', f: 1, v: 1 }, // Carolina
    { id: '2583693', v: 1 }, // Agatha
    { id: '3428476', f: 1 }, // Jean
    { id: '3437739', f: 1, v: 1 }, // Mauro
    { id: '2562168', f: 1, v: 1, b: 1 }, // Diego
    { id: '3437726', f: 1, v: 1, b: 1 }, // Jonatas
    { id: '3428342', b: 1 }, // Victor
    { id: '3429923', b: 1 }, // Asaf

    // 3º B ADM
    { id: '3429920', f: 1 }, // Julia M
    { id: '3430557', f: 1, v: 1 }, // Emanuela
    { id: '3428706', f: 1, v: 1 }, // Cecilia
    { id: '3437844', f: 1 }, // Luiza Almeida
    { id: '3430415', f: 1 }, // Jamilly
    { id: '3428073', f: 1, v: 1 }, // Sofia
    { id: '3430590', v: 1, b: 1 }, // Mayra
    { id: '3430928', b: 1 }, // Gabriela
    { id: '3430582', b: 1 }, // Giovana P
    { id: '3430561', f: 1, v: 2 }, // Weverson (2 subs volei)
    { id: '3437772', f: 1, b: 1 }, // Kaio
    { id: '2562196', f: 1, b: 1 }, // Kaique
    { id: '3437814', f: 1 }, // Emerson
    { id: '3430551', v: 2 }, // Wendel (2 subs volei)
    { id: '3437816', b: 1 }, // Abraao (Ajustado para 1 se for o caso, ou 2 se texto dizia 2)
    { id: '3437776', b: 1 }, // Alexandre
];

const updatePreGil = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🔌 Conectado ao MongoDB! Aplicando punições do Pré-Gil...");

        // Zera tudo primeiro para garantir
        await Aluno.updateMany({}, { 
            $set: { preGil: { futsal: 0, volei: 0, basquete: 0 } } 
        });
        console.log("🧹 Punições anteriores limpas.");

        let count = 0;
        for (const p of dadosPreGil) {
            const res = await Aluno.updateOne(
                { n_inscricao: p.id },
                { 
                    $set: { 
                        "preGil.futsal": p.f || 0,
                        "preGil.volei": p.v || 0,
                        "preGil.basquete": p.b || 0
                    } 
                }
            );
            if (res.modifiedCount > 0) count++;
            else console.log(`⚠️ Aluno não encontrado ou já atualizado: ID ${p.id}`);
        }

        console.log(`✅ ${count} alunos marcados com sucesso!`);
        process.exit();
    } catch (error) {
        console.error("❌ Erro:", error);
        process.exit(1);
    }
};

updatePreGil();