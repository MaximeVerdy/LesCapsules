// appel du module mongoose
var mongoose = require('mongoose')

// création du schéma discussion et typage de ses propriétés
const discussionSchema = mongoose.Schema({
    capsuleRef: { type: mongoose.Schema.Types.ObjectId, ref: 'capsules' }, 
    lastMessageDate: Date,
    users: Array, 
    messages: Array,
})

// lien entre le modèle défini ici et la collection messages sur mongoDB
var discussionModel = mongoose.model('messages', discussionSchema)

module.exports = discussionModel;