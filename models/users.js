// appel du module mongoose
var mongoose = require('mongoose')

// création du modèle user
const userSchema = mongoose.Schema({
    email: String,
    password: String,
    token: String,
    salt: String, 
    favorites: Array,
    newMessage: Boolean,
})

var userModel = mongoose.model('users', userSchema)

module.exports = userModel;