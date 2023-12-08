const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  personnummer: String, 
  password: String      
});

userSchema.pre(
  'save',
  async function(next) {
    const user = this;
    //hash password for storing securely inside the database
    const hash = await bcrypt.hash(this.password, 10);

    this.password = hash;
    next();
  }
);

//maybe this shouldn't be in user.js
userSchema.methods.isValidPassword = async function(password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
}

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;
