const Config = require('../models/config.model');

// Pega a config (cria se não existir)
const getConfig = async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = await Config.create({});
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar configs" });
  }
};

// Atualiza a config (Texto - SiteName, etc)
const updateConfig = async (req, res) => {
  try {
    const { siteName, logoUrl } = req.body;
    let config = await Config.findOne();
    if (!config) config = await Config.create({});
    
    // Se vier siteName no body, atualiza. Se vier logoUrl (texto manual), atualiza.
    if (siteName) config.siteName = siteName;
    if (logoUrl) config.logoUrl = logoUrl;
    
    await config.save();
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar configs" });
  }
};

// NOVO: Atualiza APENAS a Logo via Upload
const updateLogo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Nenhum arquivo enviado." });
        }

        // Caminho relativo para salvar no banco (Frontend usa isso no src)
        // O path vem algo como 'uploads/config/logo-123.png', precisamos adicionar a / na frente se não tiver
        const logoPath = `/uploads/config/${req.file.filename}`;

        let config = await Config.findOne();
        if (!config) config = await Config.create({});

        config.logoUrl = logoPath;
        await config.save();

        return res.status(200).json({ 
            message: "Logo atualizada com sucesso!", 
            logoUrl: logoPath,
            config 
        });

    } catch (error) {
        console.error("Erro no updateLogo:", error);
        return res.status(500).json({ message: "Erro ao processar upload da logo." });
    }
};

module.exports = { getConfig, updateConfig, updateLogo };