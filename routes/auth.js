const router = require('express').Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')

//REGISTER
router.post("/register", async (req, res) => {
    try {
        //check if user already exists
        let checkUser =  await User.findOne({ email: req.body.email })
        if(!checkUser) checkUser = await User.findOne({ username: req.body.username })
    console.log(checkUser)
        if(checkUser)
        return res.status(400).json("Duplicate user exists")    
    //generate new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
      //create new user
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });
  
      //save user and respond
      const user = await newUser.save();
      res.status(200).json(user);
      return
    } catch (err) {
        console.log(err)
      return res.status(500).json(err)
    }
  });
  
  //LOGIN
  router.post("/login", async (req, res) => {
    try {
        let user = null
        if(req.body.email)
            user = await User.findOne({ email: req.body.email });
        else if(req.body.username)
            user = await User.findOne({ username: req.body.username });
        else{
            res.status(400).json({"message":"Missing credentials"})
            return
        }

            if(user){
                const validPassword = await bcrypt.compare(req.body.password, user.password);
                !validPassword && res.status(400).json("wrong password")
                res.status(200).json(user)
                return
            }
            else
                res.status(404).json("user not found");
    } catch (err) {
    res.status(500).json(err)
    console.log(err)
    }
  });
  

module.exports = router