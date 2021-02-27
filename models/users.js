// appel du module mongoose
var mongoose = require('mongoose')

// création du schéma user et typage de ses propriétés
const userSchema = mongoose.Schema({
    email: String,
    password: String,
    token: String,
    salt: String, 
    favorites: Array,
    newMessage: Boolean,
    notifications:  Boolean,
})

// lien entre le modèle défini ici et la collection users sur mongoDB
var userModel = mongoose.model('users', userSchema)

module.exports = userModel;