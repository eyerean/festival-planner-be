const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// define the mongoose user model 
const userSchema = new Schema({
  name: String,
  password: String,
  admin: Boolean
});

//On save hook, encrypt password
userSchema.pre('save', function(next) {
  const user = this;
  bcrypt.genSalt(10, function(err, salt) {
    if(err) throw err;

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if(err) throw err;

      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) throw err;
    
    callback(null, isMatch);
  })
};

// create the model class
const ModelClass = mongoose.model('User', userSchema);

//export the model
module.exports = ModelClass;
