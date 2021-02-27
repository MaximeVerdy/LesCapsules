// appel du module mongoose
var mongoose = require('mongoose')

// création du schéma capsule et typage de ses propriétés
const capsuleSchema = mongoose.Schema({
    brand: String,
    country: String,
    year: String,
    photo: String,
    capsuleRef: String, 
    token: String,
})

// lien entre le modèle défini ici et la collection capsules sur mongoDB
var capsuleModel = mongoose.model('capsules', capsuleSchema)

module.exports = capsuleModel;