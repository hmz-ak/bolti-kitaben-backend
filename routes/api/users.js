var express = require("express");
var router = express.Router();
var { User } = require("../../model/users");
var bcrypt = require("bcryptjs");
var _ = require("lodash");
var jwt = require("jsonwebtoken");
var config = require("config");
const auth  = require("../../middleware/auth");

router.get('/',async(req,res)=>{
  const users = await User.find();
  res.send(users);
});

router.put('/:id',async(req,res)=>{
  const user = await User.findById(req.params.id);
  console.log(typeof req.body.role);
  if(req.body.role === "user" || req.body.role === "admin"){
    user.role = req.body.role;
  
    await user.save();
    res.send(user);
  
  }else{
   return res.status(400).send("You can either type user or admin")
    
  }
 
});

router.post("/register", async (req, res) => {
  var email = req.body.email;
  let user = await User.findOne({ email });
  if (user) return res.status(400).send("User with this email already exist");
  user = new User();
  user.first_name = req.body.first_name;
  user.last_name = req.body.last_name;
  user.email = req.body.email;
  user.password = req.body.password;
  await user.generatePasswordHash();
  await user.save();
  res.send(_.pick(user, ["name", "email"]));
});

router.post("/login", async (req, res) => {
  console.log(req.body);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(401).send("This email is not registered");
  const isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) return res.status(401).send("Password incorrect");
  var token = jwt.sign(
    { _id: user._id, first_name: user.first_name, last_name: user.last_name, email: user.email },
    config.get("jwtPrivateKey")
  );
  console.log(user);
  let user_data = {
    token,
    role:user.role,
  }
  res.send(user_data);
});

router.post("/login_google", async (req, res) => {
  let user = await User.findOne({ email: req.body.result.email });
  if (!user) {
  user = new User();
  user.first_name = req.body.result.givenName;
  user.last_name = req.body.result.familyName;
  user.authType="Google",
  user.email = req.body.result.email;
  user.password = req.body.token;
  await user.generatePasswordHash();
  await user.save();
  } 
  var token = jwt.sign(
    { _id: user._id, first_name: user.first_name, last_name: user.last_name, email: user.email },
    config.get("jwtPrivateKey")
  );
  res.send(token);
});

router.post("/login_verify",auth,async (req,res)=>{
  console.log("success");
  res.return("success");
})

router.post("/login_facebook", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
  user = new User();
  user.first_name = req.body.first_name;
  user.last_name = req.body.last_name;
  user.authType="Facebook",
  user.email = req.body.email;
  user.password = req.body.token;
  await user.generatePasswordHash();
  await user.save();
  } 
  var token = jwt.sign(
    { _id: user._id, first_name: user.first_name, last_name: user.last_name, email: user.email },
    config.get("jwtPrivateKey")
  );
  res.send(token);
});

module.exports = router;
