const express = require('express');
const router = express.Router();

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const { MongoUnexpectedServerResponseError } = require('mongodb');
const User = require('../models/User.model');
const Task = require('../models/Task.model');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
//All the work related to make dashboard functional

router.get("/dashboard", isLoggedIn, (req, res, next) => {
  // we console log the ID of the current user login
  console.log("user-check", req.session.currentUser._id)
  // we use mongoose method to search a user by id in the database
  User.findById(req.session.currentUser._id)
  .populate("tasks")
  .then(user=>{
   // we check the response from database in order to see which user is currently in the app
    // console.log("user response",user)
  console.log('user tasks-----',user.tasks)

    // We will render the dashboard view, with the data what we retrieved from the database
  res.render("dashboard",user);
  })

})
// we add a task
router.post("/dashboard/addtask", isLoggedIn, (req, res, next) => {
// we check what we send through the form
console.log("req.body", req.body)
// we get the data from the form
const {title,amount} = req.body
// we create a new task and store it in the database, with the data from the form and we set the validated to false
Task.create({title, amount, validated:false, confirmed:false})
.then(taskCreated=>{
  return User.findByIdAndUpdate (req.session.currentUser._id, { $push: { tasks:taskCreated }}, {new:true})

})
.then(user => {
  // we reload the page redirecting to the dashboard page
  res.redirect("/dashboard");
})
})
module.exports = router;
