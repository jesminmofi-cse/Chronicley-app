const express=require('express');
const router=express.Router();
const {getMeditations, addMeditation}=require('../controllers/meditationController');
const authMiddleware= require('../middleware/authMiddleware');
router.get('/',getMeditations);
router.post('/',authMiddleware,addMeditation);
module.exports=router;