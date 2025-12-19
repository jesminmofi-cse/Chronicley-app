const Meditation=require("../models/Meditation");
const { create } = require("../models/User");
const getMeditations= async(req,res)=>{
    try{
        const {type}=req.query;
        const query=type ? {type}:{};
        const meditations=await Meditation.find(query).sort({createdAt:-1});
        res.json(meditations);
    }catch(err){
        console.error('Error fetching meditations:',err.message);
        res.status(500).json({message:'Internal server error'});

    }
};
const addMeditation= async(req,res)=>{
    const {title, type, duration, videoUrl}=req.body;
    if (!title || !type || !duration || !videoUrl){
        return res.status(400).json({message:'All field are required'});
    }
    try{
        const newMeditation=await Meditation.create({title, type, duration, videoUrl});
        res.status(201).json(newMeditation);
    }catch(err){
        console.error('Error creating meditation:', err.message);
        res.status(500).json({message:'Internal server error'});
    }
};
module.exports={
    getMeditations,
    addMeditation,
}