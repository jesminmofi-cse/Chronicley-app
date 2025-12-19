const express = require ('express');
const router= express.Router();
const {createPhoto, getPhotos, deletePhoto}=require('../controllers/photoController');
const protect= require('../middleware/authMiddleware');
router.post('/',protect, createPhoto);
router.get('/',protect, getPhotos);
router.delete('/:id', protect, deletePhoto);
module.exports=router;