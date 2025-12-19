const mongoose =require('mongoose');
const meditationSchema=new mongoose.Schema({
    title:{type:String, required:true, trim:true},
    type:{type:String, required:true, enum: ['morning', 'anxiety', 'focus', 'sleep', 'relaxation'],},
    duration:{type:String, required:true},
    videoUrl:{type:String,required:true},

},{timestamps:true});
module.exprts=mongoose.model('Meditation',meditationSchema);
