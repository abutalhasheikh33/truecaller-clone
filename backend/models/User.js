const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


// User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    city: String,
    country: String
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      return next();
    }
  
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  
    next();
  
})
  

const User = mongoose.model('User', userSchema);

module.exports = User;