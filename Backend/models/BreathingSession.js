const mongoose=require('mongoose');
const breathingSessionSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,
        ref:'User',required:true,
    },
    roundsCompleted:{
        type:Number,
        required:true,
        default:0,
    },
    date:{
        type:Date,
        default:Date.now,
    }
},{timestamps:true});
module.exports=mongoose.model('BreathingSession', breathingSessionSchema);