require('dotenv').config();
var db = require('../models');
var passport = require('../config/passport');
var router = require('express').Router();
const { Op } = require('sequelize');

//Bcrypt
var bcrypt = require('bcryptjs');
const saltRounds = 10;

//user routes below
// Using the passport.authenticate middleware with our local strategy.
// If the user has valid login credentials, send them to the members page.
// Otherwise the user will be sent an error
router.post("/login", passport.authenticate("local"), function (req, res) {
    console.log("===================================")
    console.log("[User Log In - 61]")
    console.log("===================================")
    res.json(req.user);
  });
  
  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  router.post("/signup", function (req, res) {
    console.log("===================================")
    console.log("[Sign Up - 71]")
    console.log("===================================")
    db.User.create({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
      first_name: req.body.fName,
      last_name: req.body.lName,
      points: 0
    })
      .then(function (dbUser) {
        req.login(dbUser, function (err) {
          if (err) {
            console.log(err);
          }
        })
        res.json(dbUser);
      })
      .catch(function (err) {
        console.log(err.errors[0].message)
        res.status(401).json({ error: err.errors[0].message });
  
      });
  });
  
  // Route for logging user out
  router.get("/logout", function (req, res) {
    console.log("===================================")
    console.log("[Log Out - 142]")
    console.log("===================================")
    req.logout();
    res.json({ message: "Logging out" });
  });
  
  // Route for getting some data about our user to be used client side
  router.get("/user_data", function (req, res) {
    console.log("===================================")
    console.log("[Get User Data - 151]")
    console.log("===================================")
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({ response: "User Not Logged In" });
    } else {
      // Otherwise perform API call to find users updated information then send information back to client
      db.User.findOne({
        where: {
          id: req.user.id
        }
      }).then(function (dbUser) {
        res.json({
          id: dbUser.id,
          username: dbUser.username,
          email: dbUser.email,
          first_name: dbUser.first_name,
          last_name: dbUser.last_name,
         
        });
      });
    }
  });
  
  
  //Update user account info
  // Post for changing the 'completed' to true
  router.post("/users/account_update", (req, res) => {
    console.log("===================================")
    console.log("[Account Information Update - 193]")
    console.log("===================================")
    db.User.update(
      {
        [req.body.field]: req.body.value
      },
      {
        where: {
          id: req.body.user_id
        }
      }
    )
      .then(function (dbUpdatedUser) {
        res.json(dbUpdatedUser);
      })
      .catch(function (err) {
        res.json(err);
      });
  });
  
  //Updating user password
  router.post("/users/password_update", (req, res) => {
    console.log("===================================")
    console.log("[Account Password Update - 216]")
    console.log("===================================")
    //Find users old password in database
    db.User.findOne({
      where: {
        id: req.body.user_id
      }
    }).then(dbUser => {
      //Compare database password with user input old password
      bcrypt.compare(req.body.old_password, dbUser.password)
        .then(result => {
          //if result === true
          if (result) {
            //Hash the new password
            bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
              //update the db with the new hased password
              db.User.update({
                password: hash
              }, {
                where: {
                  id: req.body.user_id
                }
              }).then(userData => {
                //return userData
                res.json(userData)
              }).catch(err => {
                //return error
                res.status(401).json(err.errors[0].message)
              })
            })
            //if result === false
          } else {
            //return failure
            res.json({
              update: "Failed",
              message: "Incorrect old password"
            })
          }
        })
    })
  })
  
  router.post("/users/add_points", (req, res) => {
    console.log(req.body)
    db.User.update({
      points: req.body.points
    }, {
      where: {
        id: req.body.id
      }
    })
      .then(pointData => {
        res.json(pointData)
      }).catch(err => {
        console.log(err)
      })
  })