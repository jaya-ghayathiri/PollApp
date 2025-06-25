const mongoose=require('mongoose');
const optionSchema=new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    votes:{
        type:Number,
        default:0
    }
})

const pollSchema=new mongoose.Schema({
    question:{
        type:String,
        required:true
    },
    options:{
        type:[optionSchema],
        validate:[arr => arr.length >= 2 && arr.length <= 4, 'Poll must have 2 to 4 options']
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    

})

module.exports=mongoose.model("Poll",pollSchema);