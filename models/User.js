const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// === Modèle de données pour les utilisateurs ===
const userSchema = mongoose.Schema({
    userId: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// === Utilisation du package uniqueValidator pour utilisation d'adresse mail unique ===
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);