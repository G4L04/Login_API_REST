//Variables Imports Section
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValid, loginValid } = require("./validate");
// CODE to User Controlls with Register and Login && Access TOKEN
const userController = {
  register: async (req, res) => {
    //---Validate-----
      const { error } = registerValid(req.body);
        if (error) {
          return res.status(400).send(error.message);
        } 
    // Code to Register
      //----verify user existence------
            const selectedUser = await User.findOne({ email: req.body.email });
              if (selectedUser) {
                  return res.status(400).send("Email already exist");
              }
    //-----Creating new User---
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password), 
    });s
    try {
      await user.save();
      res.send("User registered with successfly");
    } catch (err) {
      res.status(400).send(err.message);
    }
  
  },
//Code to Login
  login: async (req, res) => {
  // --------Validate---------------------
      const { error } = loginValid(req.body);
        if (error) {
          return res.status(400).send(error.message);
        }
  //------------------------------------------------------ 
    const selectedUser = await User.findOne({ email: req.body.email });
    if(!selectedUser){
        return res.status(400).send("Email or Password are incorrect")
    }
    const passwordandUserMatch = bcrypt.compareSync( req.body.password, selectedUser.password );
    if(!passwordandUserMatch){
        return res.status(400).send("Email or Password are incorrect")
    }     
  //Access TOKEN (create new token in your environment variables)
    const token = jwt.sign({ _id: selectedUser._id, admin: selectedUser.admin }, process.env.TOKEN_SECRET);
    res.header("authorization-token", token);
    res.send("USER LOGGED");
  },
};

module.exports = userController;