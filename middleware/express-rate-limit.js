const rateLimit = require("express-rate-limit");

// === Limites de 5 requêtes toutes les 60 minutes pour éviter la Force Brute ===
const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5
});

module.exports = apiLimiter;

