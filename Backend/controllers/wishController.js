// controllers/wishController.js
const WishEntry = require('../models/WishEntry');



const getWishes = async (req, res) => {
  try {
    const wishes = await WishEntry.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(wishes);
  } catch (err) {
    console.error("Error fetching wishes:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const toggleWishFulfilled = async (req, res) => {
  try {
    const wish = await WishEntry.findOne({ _id: req.params.id, userId: req.userId });
    if (!wish) return res.status(404).json({ message: "Wish not found" });

    wish.isFulfilled = !wish.isFulfilled;
    await wish.save();
    res.json(wish);
  } catch (err) {
    console.error("Error toggling wish:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteWish = async (req, res) => {
  try {
    const wish = await WishEntry.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!wish) return res.status(404).json({ message: "Wish not found" });

    res.json({ message: "Wish deleted successfully" });
  } catch (err) {
    console.error("Error deleting wish:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createWish=async(req,res)=>{
  const {title, targetDate, imageUrl}=req.body;
  if (!title) return res.status(400).json({message:"Title is required"});
  try{
     const newWish=await WishEntry.create({
      userId:req.userId,
      title,
      targetDate,
      imageUrl
     });
     res.status(201).json(newWish);
  }catch(err){
    console.error('Error creating wish:',err.message);
    res.status(500).json({message:'Tnternal server error'});
  }
};
module.exports = {
  createWish,
  getWishes,
  toggleWishFulfilled,
  deleteWish
};
