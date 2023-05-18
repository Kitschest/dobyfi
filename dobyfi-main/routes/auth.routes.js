const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const { findByIdAndUpdate } = require("../models/Task.model");

// GET /auth/signup
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

// POST /auth/signup
router.post("/signup", isLoggedOut, (req, res) => {
  console.log("body", req.body)
  const { name, lastname, username, email, password, age, sex, } = req.body;
  const { nameChild, lastnameChild, usernameChild, emailChild, passwordChild, ageChild, sexChild, } = req.body;
  // Check that all fields are provided
  if (!name || !lastname || !username || !email || !password || !age || !sex || !nameChild|| !lastnameChild || !usernameChild || !emailChild || !passwordChild|| !ageChild || !sexChild) {
    res.status(400).render("auth/signup", {
      errorMessage: "All fields are mandatory. Please provide your all details.",
    });
    return;
  }

  // You can add more validation here if needed

  // Create a new user - start by hashing the password
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      // Create a user and save it in the database
      // creating the parent user
        return User.create({
          name,
          lastname,
          username,
          email,
          password: hashedPassword,
          age,
          sex,
          parentAccount: true,
          childAccount: false,
          balance: 100
        });
      
      
    })
    .then(user => {
      // var userParent = user;
      return bcrypt.genSalt(saltRounds)
    })
    .then((salt) => bcrypt.hash(passwordChild, salt))
    .then((hashedPassword) => {
      // Create a user and save it in the database
      // Creating the child user
       return User.create({
          name:nameChild,
          lastname:lastnameChild,
          username:usernameChild,
          email:emailChild,
          password: hashedPassword,
          age:ageChild,
          sex:sexChild,
          parentAccount: false,
          childAccount: true,
          balance: 0
        });
      
      
    })
// we have to update the users created with the relative
    //.then(findbyIdandUpdate(parent))
    //.then(findbyIdandUpdate(child))
    .then((user) => {
      console.log("req body update parent", req.body)
      // var userChild = user;
      // console.log("parent userid",userParent._id);
      // we set the relative property of the parent to their child
    return User.findOneAndUpdate({username:req.body.username},{relative:user._id})
    })
    .then((user) => {
      // we set the relative property of the child to their parent
      return User.findOne({username:req.body.username})
          })
    .then((user) => {
// we set the relative property of the child to their parent
return User.findOneAndUpdate({username:req.body.usernameChild},{relative:user._id})
    })
    .then((user) => {
      res.redirect("/auth/login");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage: "Username and email need to be unique. Either username or email is already used.",
        });
      } else {
        //next(error);
        console.log(error)
      }
    });
});
// const nodemailer = require('nodemailer');
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     User: 'dobyfiregister@gmail.com',
//     pass: 'Works2023@',
//   },
// });
// // Send the confirmation email
// transporter.sendMail({
// from: 'dobyfiregister@gmail.com',
// to: User.email, // user.email is the email address of the user who signed up
// subject: 'Confirmation Email Registration',
// text: 'Thank you for signing up! Your account has been successfully created. Welcome to Dobyfi, where magic happens.',
// }, (error, info) => {
// if (error) {
//   console.error('Error sending email:', error);
// } else {
//   console.log('Confirmation email sent:', info.response);
// }
// });

// GET /auth/login
router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

// POST /auth/login
router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, email, password } = req.body;

  // Check that username, email, and password are provided
  if (username === "" || email === "" || password === "") {
    res.status(400).render("auth/login", {
      errorMessage:
        "All fields are mandatory. Please provide username, email and password.",
    });

    return;
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  // if (password.length < 6) {
  //   return res.status(400).render("auth/login", {
  //     errorMessage: "Your password needs to be at least 6 characters long.",
  //   });
  // }

  // Search the database for a user with the email submitted in the form
  User.findOne({ username })
    .then((user) => {
      // If the user isn't found, send an error message that user provided wrong credentials
      if (!user) {
        res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
        return;
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt
        .compare(password, user.password)
        .then((isSamePassword) => {
          if (!isSamePassword) {
            res
              .status(400)
              .render("auth/login", { errorMessage: "Wrong credentials." });
            return;
          }

          // Add the user object to the session object
          req.session.currentUser = user.toObject();
          // Remove the password field
          delete req.session.currentUser.password;
console.log("dashboard")
          res.redirect("/dashboard");
        })
        .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
    })
    .catch((err) => next(err));
});

// GET /auth/logout
router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("auth/logout", { errorMessage: err.message });
      return;
    }

    res.redirect("/");
  });
});

module.exports = router;
