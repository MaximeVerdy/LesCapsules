// appel du module mongoose
var mongoose = require('mongoose')

// création du modèle activity
const discussionSchema = mongoose.Schema({
    discussionRef: String,
    capsuleRef: String, 
    lastMessageDate: Date,
    users: Array, 
    messages: Array,
})

var discussionModel = mongoose.model('messages', discussionSchema)

module.exports = discussionModel;