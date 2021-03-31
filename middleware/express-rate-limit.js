const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5
});

module.exports = apiLimiter;

