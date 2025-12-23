const  User=require('../models/User');
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      username: newUser.name,
    });

  } catch (error) {
    console.error('REGISTER ERROR:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const loginUser=async(req,res)=>{
    const {email, password}=req.body;
    try{
        const user=await User.findOne({email});
        if (!user) return res.status(400).json({message: "User not found"});
        const isMatch=await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({message: "Invalid credentials"});
        const token=jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.status(200).json({token, username: user.name});
    }catch(error){
        res.status(500).json({message: "Internal server error", error: error.message});
    }
};
module.exports={registerUser, loginUser};
