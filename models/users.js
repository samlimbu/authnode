const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

/*connect to database
mongoose.connect(config.database);
//on connection
mongoose.connection.on('connected',()=>{
     console.log('Connected to databse ' + config.database);
})
*/
//Use schema
const UserSchema = mongoose.Schema({
     name:{
          type: String
     },
     email:{
          type: String,
          required: true
     },
     username:{
          type:String,
          required: true
     },
     password:{
          type: String,
          required: true
     }

});
const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUsers =function (callback){
     User.find(callback);
}
module.exports.getUserById =function (id, callback){
     User.findById(id, callback);
}
module.exports.getUserByUsername=function(username, callback){
     const query = {username:username}
     User.findOne(query, callback);
}
// module.exports.findByIdAndUpdate = function (id, body, callback){
//     User.findByIdAndUpdate(id, body, callback);
// }

module.exports.addUser = function(newUser, callback){
     bcrypt.genSalt(10, (err,salt)=>{
          bcrypt.hash(newUser.password, salt, (err, hash)=>{
               if(err){
                    throw err;
               }
               newUser.password = hash;
               newUser.save(callback);
               console.log('newUser.password', newUser.password);
          });
     });
}
module.exports.changePassword = function(newUser, callback){
    console.log('changePassword', newUser);
    bcrypt.genSalt(10, (err,salt)=>{
         bcrypt.hash(newUser.password, salt, (err, hash)=>{
              if(err){
                   throw err;
              }
              newUser.password = hash;
              console.log('changePassword', newUser);
              this.findOneAndUpdate({username:newUser.username} , 
                {
                    $set: { password: newUser.password }
                  }
                  , function(err,result){
                if(err){
                    console.log(err);
                }
                console.log('result', result);
              });
         });
    });
}
module.exports.comparePassword = function(candidatePassword, hash, callback){
     bcrypt.compare(candidatePassword, hash, (err, isMatch)=>{
        console.log(isMatch, hash, candidatePassword);
          if(err) throw err;
          callback(null, isMatch);
     });
}