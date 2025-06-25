const User=require('../models/userModel');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const registerUser=async(req,res)=>{
    const{email,password}=req.body;
    try{
        const userExists=await User.findOne({email});
        if(userExists) return res.status(400).json({msg:'user already exists'});

        const hashedPassword=await bcrypt.hash(password,10);
        const user=await User.create({email,password:hashedPassword});
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({token,email:user.email});
    }
    catch(err){
        res.status(500).json({msg:'Server error'});
    }
}
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, email: user.email,userId: user._id });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
module.exports={registerUser,loginUser};