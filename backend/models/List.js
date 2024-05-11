const mongoose = require('mongoose');



// User schema
const listSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        unique:true,
        required:true
    },
    list:[{
        name:{
            type:String,
            
        },
        phoneNumber:{
            type:String,
            
        }
    }]
});


const List = mongoose.model("List",listSchema);
module.exports = List;