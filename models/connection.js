// appel du module mongoose
var mongoose = require('mongoose');

// import depuis un fichier ignoré par git des identifiants mongoDB
var mongoId = require ('../notforgit/identifiants.js')

// options de la connexion à MongoDB via mongoose
var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

// connexion avec identifiants
mongoose.connect(mongoId.mongoId,
    options,
    function(err){
        console.log(err);
    }
)

module.exports = mongoose;
