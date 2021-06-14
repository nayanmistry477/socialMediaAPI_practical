const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
 
    fromID:{type:String, require:true},
    toID:{type:String, require:true},
    status:{type:String, require:true},  
    createdDateTime:{type:Date, require:true},
    
    
});

 
var Friend = module.exports = mongoose.model('friendDB', userSchema);


//This Fucntion for encrypt password 
 

module.exports.addFriend =  function (newUser, callback){
    newUser.save(callback);
}
module.exports.acceptFriend =  function (newUser, callback){
    newUser.save(callback);
}
 
module.exports.getAllAccepted =  function (callback){
    var query =  {'status':'accepted'};
    Friend.findOne(query, callback);
}
 
 
