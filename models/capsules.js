// appel du module mongoose
var mongoose = require('mongoose')

// création du modèle activity
const capsuleSchema = mongoose.Schema({
    brand: String,
    country: String,
    year: String,
    photo: String,
    capsuleRef: String, 
    token: String,
})

var capsuleModel = mongoose.model('my-capsules', capsuleSchema)

module.exports = capsuleModel;