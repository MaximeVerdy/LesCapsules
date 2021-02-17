// framework express.js
var express = require('express');
var router = express.Router();

var mongoose = require('../models/connection');

// modèles mongoose
var userModel = require('../models/users')
var capsuleModel = require('../models/capsules')
var discussionModel = require('../models/discussions')

// modules de chiffrement
var uid2 = require('uid2')
var SHA256 = require('crypto-js/sha256')
var encBase64 = require('crypto-js/enc-base64')


// ------------------- //
// route d'inscription //
// ------------------- //

router.post('/sign-up', async function (req, res, next) {

  var error = []
  var emptyInput = false
  var existingAccount = false
  var result = false
  var saveUser = null
  var token = null

  // recherche de l'existence d'un utilisateur en BDD
  const data = await userModel.findOne({
    email: req.body.emailFromFront
  })
  // conditions pour enregistrer en BDD un nouvel utilisateur
  if (data != null) {
    existingAccount = true
    error.push('Ce compte existe déjà')
  }

  if (req.body.emailFromFront == ''
    || req.body.passwordFromFront == ''
  ) {
    emptyInput = true
    error.push(' ')
  }

  // vérification du format du mot de passe
  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  if (validateEmail(req.body.emailFromFront) == false) {
    error.push('Email dans un mauvais format')
  }

  // vérification de la complexité suffisante du mot de passe
  var regex = RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$")
  if (regex.test(req.body.passwordFromFront) == false && emptyInput == false && existingAccount == false && error.length == 0
  ) {
    error.push('Mot de passe avec minuscule, majuscule, chiffre et caractère spécial requis')
  }

  // enregistrement en BDD
  if (error.length == 0) {
    var salt = uid2(32)
    var newUser = new userModel({
      email: req.body.emailFromFront,
      password: SHA256(req.body.passwordFromFront + salt).toString(encBase64),
      token: uid2(32),
      salt: salt,
      favorites: 'none yet',
      newMessage: false
    })
    saveUser = await newUser.save()


    if (saveUser) {
      result = true
      token = saveUser.token
    }
  }

  // message d'erreur d'enregistrement
  if (result == false && existingAccount == false && error.length == 0) {
    error.push('Une erreur est advenue. Enregistrement impossible')
  }

  // données envoyée en front
  res.json({ result, error, token, newMessage })
  //avant avec saveUser. c'est peu-être dangereux ??? ------------------------- à supprimer ??
  // res.json({ result, saveUser, error, token })

});


// -------------------- //
// route de reconnexion //
// -------------------- //

router.post('/sign-in', async function (req, res, next) {

  var result = false
  var user = null
  var error = []
  var token = null

  // conditions avant de chercher en BDD
  if (req.body.emailFromFront == ''
    || req.body.passwordFromFront == ''
  ) {
    error.push('Remplissez les champs de saisie')
  }

  // recherche de l'existence d'un utilisateur en BDD
  if (error.length == 0) {
    const user = await userModel.findOne({
      email: req.body.emailFromFront,
    })

    // vérification du mot de passe
    if (user) {
      const passwordEncrypt = SHA256(req.body.passwordFromFront + user.salt).toString(encBase64)

      if (passwordEncrypt == user.password) {
        result = true
        token = user.token
        newMessage = user.newMessage
      } else {
        result = false
        error.push('Mot de passe incorrect')
      }

    } else {
      error.push('Connexion impossible avec cet email')
    }
  }

  // données envoyée en front
  res.json({ result, user, error, token, newMessage })

});

// ------------------------------------- //
// route d'écriture d'une capsule en BDD //
// ------------------------------------- //

router.post('/save-capsule', async function (req, res, next) {

  var error = []
  var result = false
  var saveCapsule = null

  // enregistrement en BDD
  var newCapsule = new capsuleModel({
    // token: req.body.tokenFromFront,
    brand: req.body.brandFromFront,
    year: req.body.yearFromFront,
    country: req.body.countryFromFront,
    token: "TokenTest01", // ---------------------------- A CHANGER
    capsuleRef: uid2(32),
    photo: req.body.photoFromFront.replace(/\s/g, '+'),
  })
  // console.log(newCapsule);
  saveCapsule = await newCapsule.save()

  if (saveCapsule) {
    result = true
  }


  // message d'erreur d'enregistrement
  if (result == false) {
    error.push('Une erreur est advenue. Enregistrement impossible')
  }

  // données envoyées en front
  res.json({ result, saveCapsule, error })

})

// -------------------------------------------------- //
//        route de recherche dans tous les capsules   //
// -------------------------------------------------- //

router.get('/research', async function (req, res, next) {

  var error = []
  var capsules = []
  var brand = req.query.brand
  var year = req.query.year
  var country = req.query.country
  var token = 'lSUO1AeKD5rxBYExBqXR9m9cGF09fYn5'
  var favorites = []

  var user = await userModel.findOne({ token: 'lSUO1AeKD5rxBYExBqXR9m9cGF09fYn5' })
  if (user) {
    favorites = user.favorites
  }

  // lors du chargement du composant Research
  if (brand == '' && country == 'aucun' && year == '') {
    // recherche des données en BDD de toutes les capsules
    capsules = await capsuleModel.find()
    // recherche des données en BDD des capsules conditionnée
  } else if (brand != '' && country == 'aucun' && year == '') {
    capsules = await capsuleModel.find({ brand: new RegExp(brand, 'i') })
  } else if (brand == '' && country == 'aucun' && year != '') {
    capsules = await capsuleModel.find({ year: year })
  } else if (brand == '' && country != 'aucun' && year == '') {
    capsules = await capsuleModel.find({ country: country })
  } else if (brand == '' && country != 'aucun' && year != '') {
    capsules = await capsuleModel.find({ country: country } && { year: year })
  } else if (brand != '' && country != 'aucun' && year == '') {
    capsules = await capsuleModel.find({ brand: new RegExp(brand, 'i') } && { country: country })
  } else if (brand != '' && country == 'aucun' && year != '') {
    capsules = await capsuleModel.find({ brand: new RegExp(brand, 'i') } && { year: year })
  } else if (brand != '' && country != 'aucun' && year != '') {
    capsules = await capsuleModel.find({ brand: new RegExp(brand, 'i') } && { year: year } && { country: country })
  }


  if (capsules.length == 0) {
    error.push('Aucune capsule trouvée en base de données')
  }

  // données envoyées en front
  res.json({ capsules, favorites, error })

  // console.log('console -----------', capsules);
})


// ---------------------------------- //
//        route de la collection      //
// ---------------------------------- //

router.get('/my-collection', async function (req, res, next) {

  var error = []
  var capsules = []

  // vérification que ce token existe 
  var user = await userModel.findOne({ token: req.query.token })
  if (user != null) {
    // recherche des données en BDD
    capsules = await capsuleModel.find({ token: req.query.token })
  }

  // rangement par ordre chronologique invervé
  const sortedCapsules = capsules.sort((a, b) => b.date - a.date)

  // if (user == null) {
  //   error.push('Veuillez vous connecter')
  // }

  // --------------- temporaire temporaire temporaire temporaire temporaire temporaire temporaire
  // --------------- temporaire temporaire temporaire temporaire temporaire temporaire temporaire
  // capsules = await capsuleModel.find()

  // données envoyées en front
  res.json({ capsules, error })

})

// ------------------------------------- //
// route de suppression d'une capsule    //
// ------------------------------------- //

router.delete('/my-collection', async function (req, res, next) {

  var result = false
  var error = []

  // vérification que ce token existe 
  var user = await userModel.findOne({ token: req.body.token })
  if (user != null) {
    // suppression des données en BDD
    var deleteInDB = await capsuleModel.deleteOne({ capsuleRef: req.body.capsuleRef })

    if (deleteInDB.deletedCount == 1) {
      result = true
    }
  }

  // --------------- temporaire temporaire temporaire temporaire temporaire temporaire temporaire
  // --------------- temporaire temporaire temporaire temporaire temporaire temporaire temporaire
  var deleteInDB = await capsuleModel.deleteOne({ capsuleRef: req.body.capsuleRef })
  if (deleteInDB.deletedCount == 1) {
    result = true
  }


  // message d'erreur pour front
  if (user == null) {
    error.push('Veuillez vous connecter')
  }

  // données envoyées en front
  res.json({ result, error })

})


// ---------------------------------------------- //
// écriture d'une capsule favorite en BDD         //
// ---------------------------------------------- //

router.post('/add-favorite', async function (req, res, next) {

  var error = []
  var result = false
  var capsuleRef = ''
  var foundFavorite = false
  var favorites = []

  capsuleRef = req.body.capsuleRef

  mongoose.set('useFindAndModify', false);

  var existingUser = await userModel.findOne({ token: 'lSUO1AeKD5rxBYExBqXR9m9cGF09fYn5' })

  if (existingUser.favorites.find(capsule => capsule == capsuleRef)) {
    foundFavorite = true
  }

  if (foundFavorite == false) {
    var user = await userModel.findOneAndUpdate(
      { token: 'lSUO1AeKD5rxBYExBqXR9m9cGF09fYn5' },
      { '$push': { 'favorites': capsuleRef } }
    )
  }

  var userUpdated = await userModel.findOne({ token: 'lSUO1AeKD5rxBYExBqXR9m9cGF09fYn5' })
  favorites = userUpdated.favorites


  if (foundFavorite == true) {
    error.push('Déjà enregistré en tant que favori')
  }

  if (user) {
    result = true
  }

  // message d'erreur d'enregistrement
  if (result == false && error.length == 0) {
    error.push('Une erreur est advenue. Enregistrement impossible')
  }

  // données envoyées en front
  res.json({ result, favorites, error })
})


// ---------------------------------------------- //
// suppression d'une capsule favorite en BDD       //
// ---------------------------------------------- //

router.put('/supp-favorite', async function (req, res, next) {

  var error = []
  var result = false
  var capsuleRef = ''
  var foundFavorite = false

  capsuleRef = req.body.capsuleRef

  mongoose.set('useFindAndModify', false);

  var existingUser = await userModel.findOne({ token: 'lSUO1AeKD5rxBYExBqXR9m9cGF09fYn5' })

  if (existingUser.favorites.find(capsule => capsule == capsuleRef)) {
    foundFavorite = true
  }

  var favorites = existingUser.favorites

  var index = favorites.indexOf(capsuleRef);
  if (index > -1) {
    favorites.splice(index, 1);
  }

  if (foundFavorite == true) {
    var user = await userModel.findOneAndUpdate(
      { token: 'lSUO1AeKD5rxBYExBqXR9m9cGF09fYn5' },
      { 'favorites': favorites }
    )
  } else {
    error.push('N\'est déjà pas en favori')
  }

  if (user) {
    result = true
  }

  // message d'erreur d'enregistrement
  if (result == false && error.length == 0) {
    error.push('Une erreur est advenue. Suppression impossible')
  }

  // données envoyées en front
  res.json({ result, favorites, error })

})

// ---------------------------------------------- //
// accès à tous les favoris d'un utilisateur      //
// ---------------------------------------------- //

router.get('/all-my-favorites', async function (req, res, next) {

  var error = []
  var result = false
  var capsules = {}
  var favorites = []

  capsuleRef = req.body.capsuleRef

  var existingUser = await userModel.findOne({ token: 'lSUO1AeKD5rxBYExBqXR9m9cGF09fYn5' })

  if (existingUser) {
    favorites = existingUser.favorites
    capsules = await capsuleModel.find({ capsuleRef: { $in: favorites } })
    // for (i=0; i<favorites.length; i++) {
    // }
  }

  if (existingUser) {
    result = true
  }

  // message d'erreur d'enregistrement
  if (result == false) {
    error.push('Une erreur est advenue. Favoris non trouvés')
  }

  // données envoyées en front
  res.json({ result, capsules, error })

})



// ---------------------------------------------- //
//    ajout d'une nouvelle discussion en BDD      //
// ---------------------------------------------- //

router.post('/first-message', async function (req, res, next) {

  var error = []
  var saved = false
  var updated = false
  var userIsOwner = false
  var isDiscussionExisting = false
  var capsuleRef = req.body.capsuleRef
  var token = req.body.token
  var actualDate = new Date()

  var existingUser = await userModel.findOne({ token: token })

  if (existingUser) {

    var capsule = await capsuleModel.findOne({ capsuleRef: capsuleRef })

    var capsuleOwner = capsule.token

    if (capsuleOwner == token) {
      userIsOwner = true
    } else {

      var users = [capsuleOwner, token]

      var existingDiscussion = await discussionModel.findOne({
        capsuleRef: capsuleRef,
        users: users
      })

      if (existingDiscussion) {
        isDiscussionExisting = true
        mongoose.set('useFindAndModify', false);
        var discussionUpdated = await discussionModel.findOneAndUpdate(
          { discussionRef: existingDiscussion.discussionRef },
          { 'lastMessageDate': actualDate }
        )

        if (discussionUpdated) {
          updated = true
        } else {
          error.push('discussion non updatée')
        }

      } else {
        var newDiscussion = await new discussionModel({
          discussionRef: uid2(32),
          capsuleRef: capsuleRef,
          lastMessageDate: actualDate,
          users: users,
          messages: [],
        })
        var savedDiscussion = await newDiscussion.save()
      }

      if (savedDiscussion) {
        saved = true
      }
    }

  } else {
    error.push('Cet utilisateur n\'existe pas')
  }

  // message d'erreur d'enregistrement
  if (saved == false && error.length == 0) {
    error.push('Impossible d\'écrire à vous même')
  }

  // données envoyées en front
  res.json({ saved, error, userIsOwner, isDiscussionExisting, updated })

})



// ---------------------------------------------- //
//     accès aux discussions d'un utilisateur     //
// ---------------------------------------------- //

router.get('/discussions', async function (req, res, next) {
  var result = false
  var isDiscussionsExist = false
  var error = []
  var discussionsExtended = []
  token = req.query.token

  var existingUser = await userModel.findOne({ token: token })

  if (existingUser) {
    var discussions = await discussionModel.find({ users: { $in: token } })
    if (discussions) {
      isDiscussionsExist = true
      for (i = 0; i < discussions.length; i++) {
        var capsule = await capsuleModel.findOne({ capsuleRef: discussions[i].capsuleRef })

        discussionsExtended.push({
          discussionRef: discussions[i].discussionRef,
          capsuleRef: discussions[i].capsuleRef,
          lastMessageDate: discussions[i].lastMessageDate,
          users: discussions[i].users,
          messages: discussions[i].messages,
          capsuleData: capsule
        })

        var sortedDiscussions = discussionsExtended.sort((a, b) => b.lastMessageDate - a.lastMessageDate)
        result = true
      }
    } else {
      error.push('Discussions non trouvées')
    }
  } else {
    error.push('Cet utilisateur n\'existe pas')
  }

  // données envoyées en front
  res.json({result, error, sortedDiscussions })

})


// ---------------------------------------------- //
//       ajout d'un nouveau message en BDD        //
// ---------------------------------------------- //

router.post('/new-message', async function (req, res, next) {

  var error = []
  var saved = false
  var updated = false
  // var userIsOwner = false
  // var isDiscussionExisting = false
  var discussionRef = req.body.discussionRef
  var token = req.body.token
  var message = req.body.newMessage
  var actualDate = new Date()
  var formatedMessage = { token, message }

  // console.log("formatedMessage", formatedMessage);

  var existingUser = await userModel.findOne({ token: token })
  // console.log("existingUser",existingUser);

  if (existingUser) {
    mongoose.set('useFindAndModify', false);
    var discussionUpdated = await discussionModel.findOneAndUpdate(
      { discussionRef: discussionRef },
      {
        '$push': { 'messages': formatedMessage },
        'lastMessageDate': actualDate
      }
    )

    if (discussionUpdated) {
      updated = true
      var participants = discussionUpdated.users
      var authorOfMessage = participants.indexOf(token);
      if (authorOfMessage > -1) {
        participants.splice(authorOfMessage, 1);
      }
      otherParticipant = participants[0]

      var userHavingAMessage = await userModel.findOneAndUpdate(
        { token: otherParticipant,
          'newMessage': true
        }
      )
      if (!userHavingAMessage) {
        error.push('Pas de notification envoyée')
      }

      // console.log('participants----', participants);
    } else {
      error.push('discussion non updatée')
    }

  } else {
    error.push('Cet utilisateur n\'existe pas')
  }

  // données envoyées en front
  res.json({ error, updated })

})



module.exports = router;


