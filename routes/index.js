// framework express.js
var express = require('express')
var router = express.Router()

// Mongoose va servir de passerelle entre notre serveur Node.js et notre serveur MongoDB
var mongoose = require('../models/connection')

// Modèles Mongoose définis et typés dans ../models
var userModel = require('../models/users')
var capsuleModel = require('../models/capsules')
var discussionModel = require('../models/discussions')

// Option Mongoose nécessaire pour utiliser Model.findOneAndUpdate()
mongoose.set('useFindAndModify', false)

// modules de chiffrement
var SHA256 = require('crypto-js/sha256')
var encBase64 = require('crypto-js/enc-base64')

// module de génération d'identifiant unique
var uid2 = require('uid2')


// ------------------- //
// route d'inscription //
// ------------------- //

// route utilisant une méthode POST dédiée à l'écriture en BDD (base de données)
router.post('/sign-up', async function (req, res, next) {

  // caractérisation des variables qui seront utilisées dans cette route
  var error = []
  var emptyInput = false
  var existingAccount = false
  var result = false
  var saveUser = null
  var token = null
  var newMessage = false

  // recherche d'un utilisateur en BDD (base de données) correspondant à l'email envoyé dans le champ de saisie en Front
  const data = await userModel.findOne({
    email: req.body.emailFromFront
  })
  // si un utilisateur avec cet email a été trouvé en BDD alors envoi d'un message d'erreur au Front
  if (data != null) {
    existingAccount = true
    error.push('Ce compte existe déjà')
  }

  // si un des champs de saisie en Front est vide alors la variable emptyInput devient true et une chaine de caractère est ajoutée à error
  if (req.body.emailFromFront == ''
    || req.body.passwordFromFront == ''
  ) {
    emptyInput = true
    error.push(' ')
  }

  // vérification du format de l'email
  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  // si format de l'email incorrect alors message d'erreur pour le Front
  if (validateEmail(req.body.emailFromFront) == false) {
    error.push('Email dans un mauvais format')
  }

  // vérification de la complexité suffisante du mot de passe
  var regex = RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$")
  if (regex.test(req.body.passwordFromFront) == false && emptyInput == false && existingAccount == false && error.length == 0
  ) {
    // si la complexité du mot de passe est insuffisante alors message d'erreur pour le Front
    error.push('Mot de passe avec minuscule, majuscule, chiffre et caractère spécial requis')
  }

  // s'il n'y a pas d'erreurs
  if (error.length == 0) {
    // uid2 génère une chaine de caractères aléatoires complexe et unique
    // le salt servira au chiffrement du mot de passe
    var salt = uid2(32)
    // caractérisation l'object newUser en s'appuyant sur le schéma mongoose relatif, typé dans ../models/user.js
    var newUser = new userModel({
      // caractérisation de la propriété email de l'utilisateur dont la valeur est récupérée du Front
      email: req.body.emailFromFront,
      // le mot de passe sera enregristré en BDD uniquement sous forme chiffrée
      password: SHA256(req.body.passwordFromFront + salt).toString(encBase64),
      // création d'un identifiant unique et complexe qui servira sur l'application web à identifier l'utilisateur
      token: uid2(32),
      salt: salt,
      // liste des favoris que l'utilisateur pourra choisir plus tard
      favorites: 'none yet',
      // la propriété newMessage permettra d'indiquer sur l'application à l'utilsateur s'il a un nouveau message
      newMessage: false,
      // la propriété notifications permet à l'utilsateur de définir s'il souhaite recevoir un email quand il a un nouveau message sur l'application (changeable sur la page paramètres)
      notifications: true,

    })
    // enregistrement de l'objet newUser en BBD 
    saveUser = await newUser.save()

    // s'il y a eu enregistrement alors les valeurs qui seront utiles pour la suite en Front pour dépasser la page de login sont caractérisées
    if (saveUser) {
      result = true
      token = saveUser.token
    }
  }

  // message d'erreur d'enregistrement
  if (result == false && existingAccount == false && error.length == 0) {
    error.push('Une erreur est advenue. Enregistrement impossible')
  }

  // données envoyée au Front
  res.json({ result, error, token, newMessage })
});


// ------------------------------- //
//      route de reconnexion       //
// ------------------------------- //

// route utilisant une méthode POST car d'un niveau de sécurité supérieur à GET
router.post('/sign-in', async function (req, res, next) {

  // caractérisation des variables qui seront utilisées dans cette route
  var result = false
  var user = null
  var error = []
  var token = null

  // si un des champs de saisie en Front est vide alors un message d'erreur est ajoutée à error
  if (req.body.emailFromFront == ''
    || req.body.passwordFromFront == ''
  ) {
    error.push('Remplissez les champs de saisie')
  }

  //  s'il n'y pas d'erreur alors recherche d'un utilisateur en BDD
  if (error.length == 0) {
    // user est une variable qui stockera le cas échéant les propriétés du document mongoDB relatif à l'utisateur
    const user = await userModel.findOne({
      email: req.body.emailFromFront,
    })

    // vérification du mot de passe s'il existe un utilisateur avec cet email
    if (user) {
      // chiffrement du mot de passe venu du Front
      const passwordEncrypt = SHA256(req.body.passwordFromFront + user.salt).toString(encBase64)

      // comparaison de ce mot de passe chiffré avec le mot de passe chiffré contenu en BDD
      // s'ils sont égaux, les propriétés de l'objet user sont passées dans des variables dont les valeurs seront envoyées au Front
      if (passwordEncrypt == user.password) {
        result = true
        token = user.token
        newMessage = user.newMessage
        notifications = user.notifications
        // sinon un message d'erreur est ajouté à la variable error qui passera en Front
      } else {
        result = false
        error.push('Mot de passe incorrect')
      }
      // sinon un message d'erreur est ajouté à la variable error qui passera en Front
    } else {
      error.push('Connexion impossible avec cet email')
    }
  }

  // données envoyées au Front
  res.json({ result, user, error, token, newMessage, notifications })
});


// ------------------------------------------ //
// route d'enregistement d'une capsule en BDD //
// ------------------------------------------ //

// route utilisant une méthode POST dédiée à l'écriture en BDD (base de données)
router.post('/save-capsule', async function (req, res, next) {

  var error = []
  var result = false
  var saveCapsule = null
  var token = req.body.tokenFromFront

  // recherche d'un utilisateur en BDD correspondant au token envoyé depuis le Front
  var user = await userModel.findOne({ token: token })
  // s'il existe un utilisateur ayant cet identifiant token
  if (user) {
    // caractérisation l'object newCapsule en s'appuyant sur le schéma mongoose relatif, typé dans ../models/capsule.js
    var newCapsule = new capsuleModel({
      token: req.body.tokenFromFront,
      brand: req.body.brandFromFront,
      year: req.body.yearFromFront,
      country: req.body.countryFromFront,
      capsuleRef: uid2(32),
      // la photo est enregistrée comme une chaine de caractères. Dans la chaine de caractère, les espaces sont remplacés par des + pour assurer l'affichage ultérieur. Le format sera ainsi reconnu
      photo: req.body.photoFromFront.replace(/\s/g, '+'),
    })
    // enregistrement de l'objet saveCapsule en BBD 
    saveCapsule = await newCapsule.save()

    // s'il y a eu enregistrement alors la valeur de result change et sera envoyé en Front
    if (saveCapsule) {
      result = true
      // sinon un message d'erreur est ajouté à la variable error qui passera en Front
    } else {
      error.push('Une erreur est advenue. Enregistrement impossible')
    }
    // sinon un message d'erreur est ajouté à la variable error qui passera en Front
  } else {
    error.push('Utilisateur inconnu')
  }

  // données envoyées au Front
  res.json({ result, saveCapsule, error })

})

// -------------------------------------------------- //
//        route de recherche dans tous les capsules   //
// -------------------------------------------------- //

// route utilisant une méthode GET car appropriée à la simple lecture de données en BDD
router.get('/research', async function (req, res, next) {

  // caractérisation des variables qui seront utilisées dans cette route
  var error = []
  var capsules = []
  var favorites = []
  var numberOfDocuments = 0
  var brand = req.query.brand
  var year = req.query.year
  var country = req.query.country
  var token = req.query.token
  // pour assurer que stepOfCapsule soit typé nombre (utile pour l'utilisation dans cette route), implication de parseFloat
  var stepOfCapsule = parseFloat(req.query.stepOfCapsule)
  // recherche d'un utilisateur en BDD correspondant au token envoyé depuis le Front
  var user = await userModel.findOne({ token: token })

  // s'il existe un utilisateur ayant cet identifiant token
  if (user) {
    // la propriété favorites de l'objet user est passée une variable dont la valeur sera envoyée au Front
    favorites = user.favorites
  }

  // si aucun critère de recherche rempli dans les champs de saisie en Front (lors du chargement du composant Research notamment)
  if (brand == '' && country == 'tous' && year == '') {
    // recherche du nombre de documents en BDD correspondant
    capsules = await capsuleModel.find().countDocuments((function (err, count) { numberOfDocuments = count }))
    // capsules est une variable qui stockera le cas échéant les propriétés des documents mongoDB relatif à ces capsules.
    // Les capsules sont cherchées en BDD par bloc de 10
    capsules = await capsuleModel.find().sort({ _id: -1 }).skip(stepOfCapsule).limit(10)

    // sinon, si des critères de recherche sont remplis dans les champs de saisie en Front :
    // recherche seulement par marque en BDD
  } else if (brand != '' && country == 'tous' && year == '') {
    capsules = await capsuleModel.find({ brand: new RegExp(brand, 'i') }).countDocuments((function (err, count) { numberOfDocuments = count }))
    capsules = await capsuleModel.find({ brand: new RegExp(brand, 'i') }).sort({ _id: -1 }).skip(stepOfCapsule).limit(10)
    // recherche seulement par année en BDD
  } else if (brand == '' && country == 'tous' && year != '') {
    capsules = await capsuleModel.find({ year: year }).countDocuments((function (err, count) { numberOfDocuments = count }))
    capsules = await capsuleModel.find({ year: year }).sort({ _id: -1 }).skip(stepOfCapsule).limit(10)
    // recherche seulement par pays en BDD
  } else if (brand == '' && country != 'tous' && year == '') {
    capsules = await capsuleModel.find({ country: country }).countDocuments((function (err, count) { numberOfDocuments = count }))
    capsules = await capsuleModel.find({ country: country }).sort({ _id: -1 }).skip(stepOfCapsule).limit(10)
    // recherche par pays et par année en BDD
  } else if (brand == '' && country != 'tous' && year != '') {
    capsules = await capsuleModel.find({ country: country, year: year }).countDocuments((function (err, count) { numberOfDocuments = count }))
    capsules = await capsuleModel.find({ country: country, year: year }).sort({ _id: -1 }).skip(stepOfCapsule).limit(10)
    // recherche par marque et par pays en BDD
  } else if (brand != '' && country != 'tous' && year == '') {
    capsules = await capsuleModel.find({ brand: new RegExp(brand, 'i'), country: country }).countDocuments((function (err, count) { numberOfDocuments = count }))
    capsules = await capsuleModel.find({ brand: new RegExp(brand, 'i'), country: country }).sort({ _id: -1 }).skip(stepOfCapsule).limit(10)
    // recherche par marque et par année en BDD
  } else if (brand != '' && country == 'tous' && year != '') {
    capsules = await capsuleModel.find({ brand: new RegExp(brand, 'i'), year: year }).countDocuments((function (err, count) { numberOfDocuments = count }))
    capsules = await capsuleModel.find({ brand: new RegExp(brand, 'i'), year: year }).sort({ _id: -1 }).skip(stepOfCapsule).limit(10)
    // recherche par marque, par pays et par année en BDD
  } else if (brand != '' && country != 'tous' && year != '') {
    capsules = await capsuleModel.find({ brand: new RegExp(brand, 'i'), year: year, country: country }).countDocuments((function (err, count) { numberOfDocuments = count }))
    capsules = await capsuleModel.find({ brand: new RegExp(brand, 'i'), year: year, country: country }).sort({ _id: -1 }).skip(stepOfCapsule).limit(10)
  }

  // s'il n'y a aucune capsule trouvée en BDD
  if (capsules.length == 0) {
    error.push('Aucune capsule à afficher')
  }

  // données envoyées au Front
  res.json({ capsules, favorites, error, numberOfDocuments })

})


// ---------------------------------- //
//        route de la collection      //
// ---------------------------------- //

// route utilisant une méthode GET car appropriée à la simple lecture de données en BDD
router.get('/my-collection', async function (req, res, next) {

  var error = []
  var capsules = []
  var result = false
  var numberOfDocuments = 0
  // pour assurer que stepOfCapsule soit typé nombre (utile pour l'utilisation dans cette route), implication de parseFloat
  var stepOfCapsule = parseFloat(req.query.stepOfCapsule)

  // recherche d'un utilisateur en BDD correspondant au token envoyé depuis le Front
  var user = await userModel.findOne({ token: req.query.token })
  // s'il existe un utilisateur ayant cet identifiant token
  if (user != null) {
    // la propriété favorites de l'objet user est passée une variable dont la valeur sera envoyée au Front
    var favorites = user.favorites
    // recherche du nombre de documents en BDD correspondant à un utilisateur
    capsules = await capsuleModel.find({ token: req.query.token }).countDocuments((function (err, count) { numberOfDocuments = count }))
    // capsules est une variable qui stockera le cas échéant les propriétés des documents mongoDB relatif à ces capsules.
    // Les capsules sont cherchées en BDD par bloc de 10
    capsules = await capsuleModel.find({ token: req.query.token }).sort({ _id: -1 }).skip(stepOfCapsule).limit(10)
    // sinon un message d'erreur ajouté à error
  } else {
    error.push('Une erreur est advenue. Reconnectez-vous')
  }

  // si le tableau Object.keys(capsules) est rempli alors la valeur de result passe de false à true
  if (Object.keys(capsules).length != 0) {
    result = true
  }

  // données envoyées en front
  res.json({ result, capsules, error, favorites, numberOfDocuments })

})

// ------------------------------------- //
// route de suppression d'une capsule    //
// ------------------------------------- //

// route utilisant une méthode DELETE car appropriée à la suppression de données en BDD
router.delete('/my-collection', async function (req, res, next) {

  var result = false
  var error = []

  // recherche d'un utilisateur en BDD correspondant au token envoyé depuis le Front
  var user = await userModel.findOne({ token: req.body.token })
  // s'il existe un utilisateur ayant cet identifiant token
  if (user != null) {
    // suppression des données en BDD faisant référence à la capsule relatif
    var deleteInDB = await capsuleModel.deleteOne({ capsuleRef: req.body.capsuleRef })

    // s'il y a eu suppression alors la valeur de result passe de false à true
    if (deleteInDB.deletedCount == 1) {
      result = true
      // sinon un message d'erreur ajouté à error
    } else {
      error.push('Suppression impossible')
    }
    // sinon un message d'erreur ajouté à error
  } else {
    error.push('Une erreur est advenue. Reconnectez-vous')
  }

  // données envoyées en front
  res.json({ result, error })

})


// ---------------------------------------------- //
// écriture d'une capsule favorite en BDD         //
// ---------------------------------------------- //

// route utilisant une méthode POST dédiée à l'écriture en BDD
router.post('/add-favorite', async function (req, res, next) {

  var error = []
  var result = false
  var capsuleRef = ''
  var favorites = []
  // valeur capsuleRef de la capsule que l'utilisateur souhaite ajouter aux favoris passée à la variable capsuleRef
  var capsuleRef = req.body.capsuleRef
  var token = req.body.token

  // recherche d'un utilisateur en BDD correspondant au token envoyé depuis le Front
  var existingUser = await userModel.findOne({ token: token })

  // s'il existe alors la valeur de result passe de false à true
  if (existingUser) {
    result = true

    // si la capsule est déjà ajoutée aux favoris en BDD alors un message d'erreur est ajouté à error
    if (existingUser.favorites.find(capsule => capsule == capsuleRef)) {
      error.push('Déjà enregistré en tant que favori')
      // sinon l'identifant de la capsule est ajoutée au document user concerné
    } else {
      var user = await userModel.findOneAndUpdate(
        { token: token },
        { '$push': { 'favorites': capsuleRef } }
      )
    }
    // sinon un message d'erreur ajouté à error
  } else {
    error.push('Une erreur est advenue. Veuillez vous reconnecter')
  }

  // recherche de l'utilisateur en BDD correspondant au token
  var userUpdated = await userModel.findOne({ token: token })
  // ajout de la propriété favorites de l'objet userUpdated à la variable favorites
  favorites = userUpdated.favorites

  // données envoyées en front
  res.json({ result, favorites, error })

})


// ---------------------------------------------- //
// suppression d'une capsule favorite en BDD       //
// ---------------------------------------------- //

// route utilisant une méthode PUT car appropriée à la mise à jour de données en BDD
router.put('/supp-favorite', async function (req, res, next) {

  var error = []
  var result = false
  var capsuleRef = ''
  var capsuleRef = req.body.capsuleRef
  var token = req.body.token

  // recherche d'un utilisateur en BDD correspondant au token envoyé depuis le Front
  var existingUser = await userModel.findOne({ token: token })
  // s'il existe un utilisateur ayant cet identifiant token alors la valeur de result passe de false à true
  if (existingUser) {
    result = true

    // si la capsule est déjà ajoutée aux favoris en BDD alors...
    if (existingUser.favorites.find(capsule => capsule == capsuleRef)) {
      // ajout de la propriété favorites de l'objet existingUser à la variable favorites
      var favorites = existingUser.favorites
      // index donne la place/index de l'élément identifiant la capsule concernée dans le tableau favorites
      var index = favorites.indexOf(capsuleRef);
      if (index > -1) {
        // suppression de la place/index de l'élément identifiant la capsule concernée dans le tableau favorites
        favorites.splice(index, 1);
      }

      // mise à jour du document relatif à l'utilisateur avec le tableau favorites mis à jour
      var user = await userModel.findOneAndUpdate(
        { token: token },
        { 'favorites': favorites }
      )
      // sinon un message d'erreur ajouté à error
    } else {
      error.push('N\'est déjà pas en favori')
    }
  } else {
    // sinon un message d'erreur ajouté à error
    error.push('Une erreur est advenue. Veuillez vous reconnecter')
  }

  // données envoyées en front
  res.json({ result, favorites, error })

})

// ---------------------------------------------- //
// accès à tous les favoris d'un utilisateur      //
// ---------------------------------------------- //

// route utilisant une méthode GET car appropriée à la simple lecture de données en BDD
router.get('/all-my-favorites', async function (req, res, next) {

  var error = []
  var result = false
  var capsules = []
  var favorites = []
  var numberOfDocuments = 0

  var token = req.query.token
  // pour assurer que stepOfCapsule soit typé nombre (utile pour l'utilisation dans cette route), implication de parseFloat
  var stepOfCapsule = parseFloat(req.query.stepOfCapsule)

  // recherche d'un utilisateur en BDD correspondant au token envoyé depuis le Front
  var existingUser = await userModel.findOne({ token: token })
  // s'il existe un utilisateur ayant cet identifiant token...
  if (existingUser) {
    // ajout de la propriété favorites de l'objet existingUser à la variable favorites
    var favorites = existingUser.favorites
    // recherche du nombre de documents en BDD correspondant à un utilisateur
    var capsules = await capsuleModel.find({ capsuleRef: { $in: favorites } }).countDocuments((function (err, count) { numberOfDocuments = count }))
    // capsules est une variable qui stockera le cas échéant les propriétés des documents mongoDB relatif à ces capsules.
    // Les capsules sont cherchées en BDD par bloc de 10
    var capsules = await capsuleModel.find({ capsuleRef: { $in: favorites } }).sort({ _id: -1 }).skip(stepOfCapsule).limit(10)
    result = true

    // si le tableau Object.keys(capsules) est rempli alors les capsules seront rangées par ordre chronologique d'ajout en BDD
    if (Object.keys(capsules).length != 0) {
      capsules.sort(function (a, b) {
        return favorites.indexOf(a.capsuleRef) - favorites.indexOf(b.capsuleRef);
      });
      // inversion de l'ordre des capsules dans le tableau
      var capsulesSorted = capsules.reverse()
      // sinon un message d'erreur ajouté à error
    } else {
      error.push('Pas de favoris disponibles')
    }
  } else {
    // message d'erreur d'enregistrement ajouté à error
    error.push('Une erreur est advenue. Veuillez vous connecter')
  }

  // si le tableau est indéfini (et donc qu'il n'y a pas de favoris) alors capsulesSorted est caractérisé comme un tableau vide pour faciler l'affichage en Front
  if (capsulesSorted === undefined) {
    capsulesSorted = []
  }

  // données envoyées en front
  res.json({ result, capsulesSorted, error, numberOfDocuments })

})

// ---------------------------------------------- //
//    ajout d'une nouvelle discussion en BDD      //
// ---------------------------------------------- //

// route utilisant une méthode POST dédiée à l'écriture en BDD
router.post('/first-message', async function (req, res, next) {

  var error = []
  var updated = false
  var userIsOwner = false   // permettra de déterminer à qui ont peut envoyer un message (pas à soi même)
  var capsuleRef = req.body.capsuleRef
  var token = req.body.token
  var actualDate = new Date()   // sera utile pour classer les discussions par ordre cronologique dans le composant messages

  // recherche d'un utilisateur en BDD correspondant au token envoyé depuis le Front
  var existingUser = await userModel.findOne({ token: token })
  // s'il existe un utilisateur ayant cet identifiant token
  if (existingUser) {
    // recheche en BDD de la capsule ayant l'identifiant capsuleRef venu du Front
    var capsule = await capsuleModel.findOne({ capsuleRef: capsuleRef })
    // caractérisation du token d'utilisateur associé à cette capsule en BDD
    var capsuleOwner = capsule.token
    // si le token de l'utilisateur connecté est égal au token du propriétaire de la capsule alors la valeur de userIsOwner change et rendra impossible l'envoi de message
    if (capsuleOwner == token) {
      userIsOwner = true
      // sinon caractérisation de la variable users qui déterminera qui sont les interlocuteurs
    } else {
      var users = [capsuleOwner, token]
      // cherche d'une discussion déjà existante sur cette capsule avec ces 2 interlocuteurs
      var existingDiscussion = await discussionModel.findOne({
        capsuleRef: capsuleRef,
        users: users
      })

      // si cette discussion existe sur cette capsule avec ces 2 interlocuteurs alors la date de lastMessageDate est mise à jour
      if (existingDiscussion) {
        var discussionUpdated = await discussionModel.findOneAndUpdate(
          { discussionRef: existingDiscussion.discussionRef },
          { 'lastMessageDate': actualDate }
        )
        // si la discussion est mise à jour alors la valeur de updated change et sera utilisée en Front
        if (discussionUpdated) {
          updated = true
          // sinon un message d'erreur est ajouté à la variable error qui passera en Front
        } else {
          error.push('discussion non updatée')
        }

        // sinon (si la discussion n'existe pas encore en BDD), création d'un objet newDiscussion en s'appuyant sur le schéma mongoose relatif, typé dans ../models/discussion.js
      } else {
        var newDiscussion = await new discussionModel({
          discussionRef: uid2(32),
          capsuleRef: capsuleRef,
          lastMessageDate: actualDate,
          users: users,
          messages: [],
        })
        // enregistrement de l'objet newDiscussion en BBD 
        var savedDiscussion = await newDiscussion.save()

        // si la discussion a été enregistrée alors la valeur de updated change et sera utilisée en Front
        if (savedDiscussion) {
          updated = true
          // sinon un message d'erreur est ajouté à la variable error qui passera en Front
        } else {
          error.push('Création de discussion impossible')
        }
      }
    }
    // sinon un message d'erreur est ajouté à la variable error qui passera en Front
  } else {
    error.push('Cet utilisateur n\'existe pas')
  }

  // données envoyées en front
  res.json({ error, userIsOwner, updated })

})


// ---------------------------------------------- //
//     accès aux discussions d'un utilisateur     //
// ---------------------------------------------- //

// route utilisant une méthode GET car appropriée à la simple lecture de données en BDD
router.get('/discussions', async function (req, res, next) {
  var result = false
  var isDiscussionsExist = false
  var error = []
  var discussionsExtended = []
  token = req.query.token

  // en Front, au 1er affichage du composant Messages la propriété newMessage du document user relatif à l'utilisateur passe à false
  var userHavingAMessage = await userModel.findOneAndUpdate(
    { token: token },
    {
      'newMessage': false
    }
  )

  // s'il existe un utilisateur ayant cet identifiant token alors... 
  if (userHavingAMessage) {
    // la valeur de result passe de false à true
    result = true
    // recherche de toutes les discussions de l'utilisateur
    var discussions = await discussionModel.find({ users: { $in: token } })
    // s'il y a une ou des discussions alors...
    if (discussions.length != 0) {
      // la valeur de isDiscussionsExist passe de false à true, ce qui sera utile en Front
      isDiscussionsExist = true
      // boucle permettant de créer un tableau d'object combinant les propriétés des discussions avec les propriétés des capsules associées
      for (i = 0; i < discussions.length; i++) {
        var capsule = await capsuleModel.findOne({ capsuleRef: discussions[i].capsuleRef })
        // si les données de la capsule existe
        if (capsule !== null) {
          discussionsExtended.push({
            discussionRef: discussions[i].discussionRef,
            capsuleRef: discussions[i].capsuleRef,
            lastMessageDate: discussions[i].lastMessageDate,
            users: discussions[i].users,
            messages: discussions[i].messages,
            capsuleData: capsule
          })
          // sinon (si les données de la capsule sont absentes) 
        } else {
          discussionsExtended.push({
            discussionRef: discussions[i].discussionRef,
            capsuleRef: discussions[i].capsuleRef,
            lastMessageDate: discussions[i].lastMessageDate,
            users: discussions[i].users,
            messages: discussions[i].messages,
            capsuleData: {
              token: '',
              brand: 'Capsule supprimée',
              year: '',
              country: '',
              capsuleRef: '',
              photo: '',
            }
          })
        }

        // les discussions sont rangées par ordre chronologique de date enregistrée dans la propriété lastMessageDate
        var sortedDiscussions = discussionsExtended.sort((a, b) => b.lastMessageDate - a.lastMessageDate)
      }
      // sinon un message d'erreur ajouté à error
    } else {
      error.push('Aucune discussion')
    }
    // sinon un message d'erreur ajouté à error
  } else {
    error.push('Une erreur est advenue. Reconnectez-vous')
  }

  // données envoyées en front
  res.json({ result, error, sortedDiscussions, isDiscussionsExist })

})


// ---------------------------------------------- //
//       ajout d'un nouveau message en BDD        //
// ---------------------------------------------- //

// route utilisant une méthode POST dédiée à l'écriture en BDD
router.post('/new-message', async function (req, res, next) {

  var error = []
  var updated = false
  var discussionRef = req.body.discussionRef
  var token = req.body.token
  var message = req.body.newMessage
  var actualDate = new Date() // sera utile pour classer les discussions par ordre cronologique dans le composant messages
  var formatedMessage = { token, message } // le message qui sera enregistré en BDD avec le token de l'utilisateur et le contenu du message

  // recherche d'un utilisateur en BDD correspondant au token envoyé depuis le Front
  var existingUser = await userModel.findOne({ token: token })
  // s'il existe un utilisateur ayant cet identifiant token
  if (existingUser) {
    // ajout du message formaté au tableau de discussion et modification de la date de dernier message
    var discussionUpdated = await discussionModel.findOneAndUpdate(
      { discussionRef: discussionRef },
      {
        '$push': { 'messages': formatedMessage },
        'lastMessageDate': actualDate
      }
    )

    // si la discussion a été mise à jour alors ...
    if (discussionUpdated) {
      //la valeur de updated change et sera utilisée en Front
      updated = true
      // caractérisation des participants
      var participants = discussionUpdated.users
      // suppression de l'utilisateur connecté de la liste des participants 
      // en cherchant d'abord son index
      var authorOfMessage = participants.indexOf(token);
      if (authorOfMessage > -1) {
        participants.splice(authorOfMessage, 1);
      }
      // caractérisation de l'autre participant
      otherParticipant = participants[0]
      // mise à jour du document user relatif à l'autre participant pour indiquer qu'il a un nouveau message
      var userHavingAMessage = await userModel.findOneAndUpdate(
        { token: otherParticipant },
        {
          'newMessage': true
        }
      )

      // si l'autre participant à choisi de recevoir les notifications de nouveau message par email alors ...
      if (userHavingAMessage.notifications == true) {
        // appelle du module nodemailer permettant d'envoyer des emails
        var nodemailer = require('nodemailer')

        // identifiants du compte email de Les Capsules
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'lescapsules.notifications@gmail.com',
            pass: 'aA1#Developpeur'
          }
        });

        // options du message qui sera envoyé
        var mailOptions = {
          from: 'lescapsules.notifications@gmail.com',
          to: userHavingAMessage.email,
          subject: '[Les Capsules] Vous avez reçu un message :)',
          text: ' Rendez-vous sur https://les-capsules.herokuapp.com pour lire votre nouveau message. // Vous pouvez désactiver les notifications à tout moment dans la rubrique Paramètres du site',
        };
        // envoi du message
        transporter.sendMail(mailOptions, function (error, info) {
        });

        // sinon un message d'erreur est ajouté à la variable error qui passera en Front
      } else {
        error.push('Pas de notification envoyée')
      }
      // sinon un message d'erreur est ajouté à la variable error qui passera en Front
    } else {
      error.push('discussion non updatée')
    }
    // sinon un message d'erreur est ajouté à la variable error qui passera en Front
  } else {
    error.push('Cet utilisateur n\'existe pas')
  }

  // données envoyées en front
  res.json({ error, updated })
})

// ---------------------------------------------------- //
//        route de notification de nouveau message      //
// ---------------------------------------------------- //

// route utilisant une méthode GET car appropriée à la simple lecture de données en BDD
router.get('/notification-message', async function (req, res, next) {

  var notification = false
  var token = req.query.token

  // recherche d'un utilisateur en BDD correspondant au token envoyé depuis le Front
  var user = await userModel.findOne({ token: token })
  // s'il existe un utilisateur ayant cet identifiant token alors on récuppère la valeur de la propriété newMessage de l'object user
  if (user) {
    notification = user.newMessage
  }

  // données envoyées en front
  res.json({ notification })

})

// ---------------------------------------------------- //
//           route de suppression de compte             //
// ---------------------------------------------------- //

// route utilisant une méthode POST dédiée à l'écriture en BDD
router.delete('/erase-account', async function (req, res, next) {

  var result = false
  var error = []
  var token = req.body.token

  // recherche de l'utilisateur en BDD correspondant au token
  var user = await userModel.findOne({ token: token })
  // s'il existe un utilisateur ayant cet identifiant token alors...
  if (user) {
    // recherche de les discussions de l'utilisateur
    var allDiscussionsGoneUser = await discussionModel.find({ users: token })
    // si ces discussions existent en BDD alors ...
    if (allDiscussionsGoneUser) {
      // caractérisation d'un message pour prévenir les autres interlocuteurs
      var message = '[Cet utilisateur est parti]'
      // formatage de l'object message
      var formatedMessage = { token, message }

      // boucle permettant d'envoyer le message à chaque autre interlocuteur
      for (i = 0; i < allDiscussionsGoneUser.length; i++) {
        // recherche en BDD de la discussion par son identifant et envoi du message
        var discussionUpdated = await discussionModel.findOneAndUpdate(
          { discussionRef: allDiscussionsGoneUser[i].discussionRef },
          {
            '$push': { 'messages': formatedMessage }
          }
        )
      }
    }

    // suppression de l'utilisateur de la BDD
    var userDeletedInDB = await userModel.deleteOne({ token: req.body.token })
    // suppression des capsules de l'utilisateur de la BDD
    var capsuleDeletedInDB = await capsuleModel.deleteMany({ token: req.body.token })

    // si la suppression de l'utilisateur s'est faite alors la valeur de result passe de false à true et sera utilisée en Front
    if (userDeletedInDB.deletedCount == 1) {
      result = true
    } else {
      // sinon un message d'erreur ajouté à error
      error.push('Suppression impossible')
    }

    // sinon un message d'erreur ajouté à error
  } else {
    error.push('Une erreur est advenue. Reconnectez-vous')
  }

  // données envoyées en front
  res.json({ result, error })

})


// ------------------------------------------------------------ //
//       route changement de statut de notifiaction par email   //
// ------------------------------------------------------------ //

// route utilisant une méthode PUT car appropriée à la mise à jour de données en BDD
router.put('/notif-status', async function (req, res, next) {

  var result = false
  var error = []

  // recherche d'un utilisateur en BDD correspondant au token envoyé depuis le Front et modification de la propriété notifications
  var notifStatusChanged = await userModel.findOneAndUpdate(
    { token: req.body.token },
    {
      'notifications': req.body.notifications
    }
  )

  // si la modification a été faite alors la valeur de result passe de false à true et sera utilisée en Front
  if (notifStatusChanged) {
    result = true
  } else {
    // sinon un message d'erreur ajouté à error
    error.push('Changement impossible')
  }

  // données envoyées en front
  res.json({ result, error })

})



module.exports = router;


