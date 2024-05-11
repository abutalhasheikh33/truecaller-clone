const mongoose = require('mongoose');

const globalSchema = new mongoose.Schema({
    phoneNumber: {
        type:String,
        required:true,
        unique:true
    },
    name:[{
        type:String,
        
    }],
    markedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    spamLikelihoodPercentage:{
        type:Number,
        default:0
    }

});

const Global = mongoose.model('Global', globalSchema);
module.exports = Global;