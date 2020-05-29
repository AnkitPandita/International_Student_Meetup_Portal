var express = require('express');
var router = express.Router();
var userDb = require("../utilities/userDB");
var userProfileDb = require('../utilities/userProfileDB');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const { check, validationResult } = require('express-validator');

//Login and Session
router.get('/login', function (req, res) {
  if (req.session.user) {
    res.redirect('/savedConnections');
  } else {
    res.render('login');
  }
});

//GET route for login and storing user data in session
router.post("/login", urlencodedParser,
  [
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email field cannot be blank"),
    check("pass")
      .not()
      .isEmpty()
      .withMessage("Password field cannot be blank")
  ],
  function (req, res) {
    if (req.session.user == undefined) {
      const errors = validationResult(req).array();
      if (errors.length > 0) {
        console.log(errors);
        res.render('login', {
          qs: req.query,
          errorMessages: errors
        });
      }
      else {
        userDb.getSpecificUserData(req.body.email, req.body.pass).then(function (user) {
          if (user !== null) {
            req.session.user = user;
            res.redirect('/savedConnections');
          } else {
            console.log("User not found!");
            res.render('login', {
              qs: req.query,
              errorMessages: [
                {
                  value: '',
                  msg: 'Invalid Email or Password!',
                  param: 'email',
                  location: 'body'
                }
              ]
            });
          }
        }).catch(function (error) {
          console.log(error);
        });
      }
    } else {
      res.redirect('/savedConnections');
    }
  });

// Signout
router.get('/signout', function (req, res) {
  req.session.destroy();
  res.render('index', { currentUser: undefined });
});

//Save rsvp
router.get("/savedConnections/updateRSVP?", function (req, res) {
  if (req.session.user !== undefined) {
    console.log(req.query);
    if (req.query) {
      userProfileDb.saveUserConnection(req.query.status, req.query.connectionId, req.session.user.userId).then(function () {
        res.redirect('/savedConnections');
      }).catch(function (error) {
        console.log(error);
        res.redirect('/savedConnections');
      });
    }
  } else {
    res.render('login', { qs: req.query });
  }
});

//delete connection
router.get('/delete?', function (req, res) {
  if (req.session.user !== undefined) {
    if (req.query) {
      userProfileDb.removeUserConnection(req.query.connectionId, req.session.user.userId).then(function () {
        res.redirect('/savedConnections');
      }).catch(function (error) {
        console.log(error);
        res.redirect('/savedConnections');
      });
    }
  } else {
    res.render('login', { qs: req.query });
  }
});

//GET route for saved connections
router.get("/savedConnections", function (req, res) {
  if (req.session.user !== undefined) {
    userProfileDb.getUserConnections(req.session.user.userId).then(function (userSavedConnections) {
      res.render("savedConnections", {
        user: req.session.user,
        userConnections: userSavedConnections
      });
    });
  } else {
    res.render('login', { qs: req.query });
  }
});

module.exports = router;
