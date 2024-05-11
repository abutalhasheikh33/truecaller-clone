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
        required: true,
        unique:true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    city: String,
    country: String,
    personalContacts:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"List"
    }
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