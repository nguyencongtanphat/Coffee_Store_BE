const User = require("../models/user");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const saltRounds = 10;
const userController = {
  userSignupController: async (req, res) => {
    try {
      //check is username available
      const user = await User.findOne({
        where: { Username: req.body.Username },
      });
      if (user) {
        //username is existing
        res.json("your username is used, please enter another name");
      } else {
        //hash password
        const hash = await bcrypt.hash(req.body.Password, saltRounds);

        //create new user and write to database
        const newUser = User.build({
          Username: req.body.Username,
          Password: hash,
          PhoneNumber: req.body.PhoneNumber,
        });
        const response = await newUser.save();
        res.json({
          success: true,
          message: "you have successfully create account",
          data: response,
        });
      }
    } catch (e) {
      res.status(404).json(e);
      //res.send("error", e);
    }
  },
  userLoginController: async (req, res) => {
    try {
      const loginUser = req.body;
      //check is username existing
      const user = await User.findOne({
        where: { Username: loginUser.Username },
      });

      if (user) {
        //check password
        let isPasswordCorrect = await bcrypt.compare(
          loginUser.Password,
          user.Password
        );

        if (!isPasswordCorrect)
          throw new Error(`Password is incorrect`);

        //password correct
        const token = jwt.sign({ id: user._id }, process.env.PRIVATE_KEY, {
          expiresIn: "1h",
        });
        //set jwt to cookie
        res.cookie("jwt", token, { httpOnly: true });

        res.status(200).json({
          message: "login successfully",
          userInfo: {
            Username: user.Username,
            PhoneNumber: user.PhoneNumber,
          },
        });
      }
    } catch (e) {
      res.json({
        error: e.message,
      });
    }
  },
};

module.exports = userController;
