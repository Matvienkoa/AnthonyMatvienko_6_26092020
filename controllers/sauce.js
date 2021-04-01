const Sauce = require('../models/Sauce');
const fs = require('fs');

// === Middleware création de Sauce ===
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
};

// === Middleware modification de Sauce ===
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
};

// === Middleware suppression de Sauce ===
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// === Middleware affichage d'une Sauce ===
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
};

// === Middleware affichage des Sauces ===
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};

// === Middleware gestion des likes / dislikes ===
exports.likeSauce = (req, res, next) => {
  switch (req.body.like) {
      case 1:
          Sauce.updateOne({ _id: req.params.id }, {
              _id: req.params.id,
              $inc: { likes: + req.body.like },
              $push: { usersLiked: req.body.userId },
          })
          .then(() => res.status(201).json({message: "Like enregistré !"}))
          .catch(error => res.status(400).json({error}));
          break;
      case -1:
          Sauce.updateOne({ _id: req.params.id }, {
              _id: req.params.id,
              $inc: { dislikes: + req.body.like * -1 },
              $push: { usersDisliked: req.body.userId },
          })
          .then(() => res.status(201).json({message: "Dislike enregistré !"}))
          .catch(error => res.status(400).json({error}));
          break;
      case 0:
          Sauce.findOne({_id: req.params.id})
              .then(sauce => {
              console.log(sauce);
              
                  if (sauce.usersLiked.indexOf(req.body.userId) !== -1) {
                      Sauce.updateOne({ _id: req.params.id }, {
                          _id: req.params.id,
                          $inc: { likes: -1 },
                          $pull: { usersLiked: req.body.userId },
                      })
                      .then(() => res.status(201).json({ message: "Annulation du like enregistrée !" }))
                      .catch(error => res.status(400).json({error}));
                  }
              
                  if (sauce.usersDisliked.indexOf(req.body.userId) !== -1) {
                      Sauce.updateOne({_id: req.params.id}, {
                          _id: req.params.id,
                          $inc: {dislikes: -1},
                          $pull: {usersDisliked: req.body.userId}
                      })
                      .then(() => res.status(201).json({message: "Annulation du dislike enregistrée !"}))
                      .catch(error => res.status(400).json({error}));
                  }
              })
              .catch(error => res.status(500).json({error}));
          break;
      default:
          throw error;
      } 
};
