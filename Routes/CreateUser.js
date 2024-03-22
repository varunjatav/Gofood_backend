const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = "HiiIamLearningJwtAuthWithNodeExpressAndMongoDb";

router.post(
  "/createUser",
  [
    body("email","Incorrect Email").isEmail(),
    body("password","Length should not be less than 5").isLength({ min: 5 }),
    body("name", "Length should not be less than 5").isLength({ min: 5 }),
  ],
  async (req, res) => {

    const result = validationResult(req);
    if(!result.isEmpty()){
        return res.status(400).json({ errors: result.array() });
    }

    const salt = await bcrypt.genSalt(10);
    const secPassword = await bcrypt.hash(req.body.password, salt);
    try {
      await User.create({
        name: req.body.name,
        location: req.body.location,
        email: req.body.email,
        password: secPassword,
      });
      res.json({ success: true });
    } catch (error) {
      res.json({ success: false });
      console.log(error);
    }
  }
);

router.post("/loginUser", [
  body("email","Incorrect Email").isEmail(),
  body("password","Length should not be less than 5").isLength({ min: 5 }),
],
async (req, res) => {

  const result = validationResult(req);
  if(!result.isEmpty()){
      return res.status(400).json({ errors: result.array() });
  }

    try {
      let userData = await User.findOne({
        email: req.body.email,
      });
     if(!userData){
      return res.status(400).json({ errors: "Incorrrect credentials. Try Login with correct credentials."})
     }
     const pwdCompare = bcrypt.compare(req.body.password,userData.password); 
     if(!pwdCompare){
      return res.status(400).json({ errors: "Incorrrect credentials. Try Login with correct credentials."})
     }

     const data = {
      user: {
        id: userData.id,
      }
     }

     const authToken = jwt.sign(data, jwtSecret)
     return res.json({ success: true ,authToken: authToken});

    } catch (error) {
      res.json({ success: false });
      console.log(error);
    }
  }
);

module.exports = router;
