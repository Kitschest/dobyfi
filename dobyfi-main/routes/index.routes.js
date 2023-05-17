const express = require('express');
const router = express.Router();
const UserModel = require ('../models/User.model.js');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/dashboard/:userId", (req, res, next) => {
  console.log("user-check", req.session.currentUser)
  const { userId } = req.params;
  console.log("userId", userId)

  UserModel.findById(userId)
  .then(User => {
    res.render("auth/profile", User);
  })
.catch((err) => next(err));

  // res.render("dashboard");
})


module.exports = router;
