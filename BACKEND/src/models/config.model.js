const mongoose = require('mongoose');
const configSchema = new mongoose.Schema({
  siteName: { type: String, default: "INTERGIL 2K25" },
  logoUrl: { type: String, default: "/images/ete-logo.png" } // Caminho da logo atual
});
module.exports = mongoose.model('Config', configSchema);