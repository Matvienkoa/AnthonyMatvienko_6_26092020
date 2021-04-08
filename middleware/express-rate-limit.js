const rateLimit = require("express-rate-limit");

// === Limites de 100 requêtes toutes les 60 minutes pour éviter la Force Brute ===
const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100
});

module.exports = apiLimiter;

