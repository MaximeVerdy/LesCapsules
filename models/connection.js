// appel du module mongoose
var mongoose = require('mongoose');

// configuration de la connexion à MongoDB via mongoose
var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

// connexion avec identifiants
mongoose.connect('mongodb+srv://admin:mongoPWverdy80@cluster0.oimhm.mongodb.net/capsules?retryWrites=true&w=majority',
    options,
    function(err){
        console.log(err);
    }
)

module.exports = mongoose;
