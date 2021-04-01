const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const apiLimiter = require('./middleware/express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const app = express();

// === Config Package dotenv ===
require('dotenv').config();

// === Connexion à la BDD mongodb, utilisation de variables d'environnement ===
mongoose.connect('mongodb+srv://'+process.env.LOGIN+':'+process.env.PASSWORD+'@'+process.env.URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// === Configuration des headers, CORS ===
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(helmet());
app.use(express.json());
app.use(mongoSanitize());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', apiLimiter, userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;