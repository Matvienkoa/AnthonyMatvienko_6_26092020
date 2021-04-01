const passwordValidator = require('password-validator');
const passwordSchema = new passwordValidator();
 
// === Schéma pour les Mots de Pass => validation des entrées ===
passwordSchema
.is().min(8)
.is().max(12)                                                                  
.has().uppercase(1)                            
.has().lowercase(1)                        
.has().digits(1)                             
.has().not().spaces()                   

module.exports = passwordSchema;