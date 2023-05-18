const express = require("express");
const router = express.Router();

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const { MongoUnexpectedServerResponseError } = require("mongodb");
const User = require("../models/User.model");
const Task = require("../models/Task.model");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
//All the work related to make dashboard functional

router.get("/dashboard", isLoggedIn, (req, res, next) => {
  // we console log the ID of the current user login
  console.log("user-check", req.session.currentUser._id);
  // we use mongoose method to search a user by id in the database
  User.findById(req.session.currentUser._id)
    .populate("tasks")
    .then((user) => {
      // we check the response from database in order to see which user is currently in the app
      // console.log("user response",user)
      console.log("user tasks-----", user.tasks);

      // We will render the dashboard view, with the data what we retrieved from the database
      res.render("dashboard", user);
    });
});
// we add a task
router.post("/dashboard/addtask", isLoggedIn, (req, res, next) => {
  // we check what we send through the form
  console.log("req.body", req.body);
  // we get the data from the form
  const { title, amount } = req.body;
  // we create a new task and store it in the database, with the data from the form and we set the validated to false
  Task.create({ title, amount, validated: false, confirmed: false })
    .then((taskCreated) => {
      return User.findByIdAndUpdate(
        req.session.currentUser._id,
        { $push: { tasks: taskCreated } },
        { new: true }
      );
    })
    .then((user) => {
  console.log("req.body", req.body);

      return Task.findOne({title})
    })
    .then((taskCreated) => {
      console.log("req session relative",req.session.currentUser.relative)
      return User.findByIdAndUpdate(
        req.session.currentUser.relative,
        { $push: { tasks: taskCreated } },
        { new: true }
      );
    })
    .then((user) => {
      // we reload the page redirecting to the dashboard page
      res.redirect("/dashboard");
    });
});

router.post("/dashboard/defaultbalance", isLoggedIn, (req, res, next) => {
  User.findByIdAndUpdate(
    req.session.currentUser._id,
    { balance:100
      },
  )
.then(user => {
  res.redirect("/dashboard")
})
})

//////////////////
router.post("/dashboard/delete/:_id", isLoggedIn, (req, res, next) => {
  console.info("params:", req.params);
  const { _id } = req.params;
  Task.deleteOne({ _id })
  .then((taskDeleted) => {
    return User.findByIdAndUpdate(
      req.session.currentUser._id,
      {
        $pullAll: {
            tasks: [{_id: req.params._id}],
        },
    });
    
  })
  .then((userUpdated) => {
    return User.findByIdAndUpdate(
      req.session.currentUser.relative,
      {
        $pullAll: {
            tasks: [{_id: req.params._id}],
        },
    });
    
  })
  .then(user => {
    res.redirect("/dashboard")
  })
});
// we create this route to validate the task
router.post("/dashboard/validate/:_id", isLoggedIn, (req, res, next) => {
  // we check the ID of the task that we get from the route
  console.info("params:", req.params);
  const { _id } = req.params;
  console.log("req.body-----",req.body)
  // we get the task with the id that we got
  Task.findById(_id)
  .then(task => {
    // we decrease the value of the task
if (task.confirmed){
  const taskValue = -task.amount
  console.log("taskvalue",taskValue);
  return User.findByIdAndUpdate(req.session.currentUser._id,{
    $inc: {
      balance:taskValue ,
    }
  });
} else {
  res.redirect("/dashboard")
  throw "cancel";

}

  })
  .then(userUpdated=>{
    return Task.findById(_id)
    
  })
  .then(task => {
    console.log('thus the task to update ------', task)
return User.findByIdAndUpdate(req.session.currentUser.relative,{
  $inc: {
    balance:task.amount ,
  }
})

  })
  .then(userUpdated=>{
    return Task.deleteOne({ _id: req.params._id})
    
  })
  .then((taskDeleted) => {
    return User.findByIdAndUpdate(
      req.session.currentUser._id,
      {
        $pullAll: {
            tasks: [{_id: req.params._id}],
        }
    });
    
  })
  .then((taskDeleted) => {
    return User.findByIdAndUpdate(
      req.session.currentUser.relative,
      {
        $pullAll: {
            tasks: [{_id: req.params._id}],
        }
    });
    
  })
  .then(user => {
    res.redirect("/dashboard")
  })
  .catch(err=>{
    next(err)
  })

});

router.post("/dashboard/confirm/:_id", isLoggedIn, (req, res, next) => {
  // we check the ID of the task that we get from the route
  console.info("params:", req.params);
  const { _id } = req.params;
  console.log("req.body-----",req.body)
  // we get the task with the id that we got
  Task.findById(_id)
  .then(task => {
    // we decrease the value of the task
if (!task.confirmed){
  // const taskValue = -task.amount
  console.log("task-Confirm--------");
  return Task.findByIdAndUpdate(_id,{
    
      confirmed:true ,
    
  });
} else {
  res.redirect("/dashboard")
  throw "cancel";

}
  })
  .then(user => {
    console.log("confirmed task",_id);
    res.redirect("/dashboard")
  })
  .catch(err=>{
    next(err)
  })

});
module.exports = router;
