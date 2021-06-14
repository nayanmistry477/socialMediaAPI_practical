const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
 
    firstname:{type:String, require:true},
    lastname:{type:String, require:true},
    email:{type:String, require:true}, 
    status:{type:Boolean, require:true},
    password:{type:String, require:true},  
    createdBy:{type:String, require:true},
    createdDateTime:{type:Date, require:true},
    updatedBy:{type:String},
    updatedDate:{type:Date}  
    
});

 
var User = module.exports = mongoose.model('userData', userSchema);


//This Fucntion for encrypt password 
 

module.exports.createUser =  function (newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            
            newUser.password = hash;
            newUser.save(callback);
        });
    });
} 
module.exports.getUserByEmail =  function (username, callback){
    var query =  {'email': username, 'status':true};
    User.findOne(query, callback);
}

module.exports.comparePassword = function (candidatePassword, hash, callback){

    bcrypt.compare(candidatePassword, hash, function (err, isMatch){
        if(err) throw err;
        callback(null, isMatch);
    });
} 
module.exports.getLoggedinUser = function (id,callback){
    var query = {'_id':id}
    User.findOne(query,callback);
} 
 
 
module.exports.getAllRequestByID = function (id,callback){
    var query = {'_id':id}
    User.findOne(query,callback);
}

 
 
