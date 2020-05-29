var express = require('express');
var router = express.Router();
var connectionDB = require('../utilities/connectionDB');
var userProfileDb = require('../utilities/userProfileDB');
var bodyParser = require('body-parser');
var moment = require('moment');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const { check, validationResult } = require('express-validator');
var currentDate = moment().format();
var selectDate = moment().add(1, 'days').format('YYYY-MM-DD');

router.get('/connection?', function (req, res) {
  if (req.query) {
    connectionDB.getConnection(req.query.connectionId).then(function (connection) {
      if (connection != null) {
        res.render("connection", {
          connectionDetails: connection,
          user: req.session.user
        });
      } else {
        res.redirect('/connections');
      }
    });
  } else {
    res.send("Error 404");
  }
});

router.get('/connections', function (req, res) {
  connectionDB.getConnections().then(function (connectionData) {
    if (Object.keys(connectionData).length > 0) {
      res.render("connections", {
        connectionData: connectionData,
        user: req.session.user
      });
    } else {
      res.send("No connections");
    }
  });
});

router.get('/startNewConnection', function (req, res) {
  if (req.session.user !== undefined) {
    res.render('startNewConnection', {
      errorMessages: [],
      user: req.session.user,
      selectDate: selectDate
    });
  } else {
    res.render('login', { qs: req.query });
  }
});

router.post("/startNewConnection", urlencodedParser,
  [check("name")
    .isLength({ min: 3 })
    .withMessage("must be 3 or more characters")
    .matches(/^[\w\-\s]+$/)
    .withMessage("can contain letters, numbers, '_', '-', and spaces only"),
  check("topic")
    .isLength({ min: 3 })
    .withMessage("must be 3 or more characters")
    .matches(/^[\w\-\s]+$/)
    .withMessage("can contain letters, numbers, '_', '-', and spaces only"),
  check("by")
    .isLength({ min: 2 })
    .withMessage("must be 2 or more characters")
    .matches(/^[\w\-\s]+$/)
    .withMessage("can contain letters, numbers, '_', '-', and spaces only"),
  check("details")
    .isLength({ min: 15 })
    .withMessage("must be 15 or more characters"),
  check("location")
    .isLength({ min: 3 })
    .withMessage("must be 3 or more characters"),
  check("date")
    .not().isEmpty()
    .withMessage("Date is required")
    .isAfter(currentDate)
    .withMessage("must be after today's date"),
  check("time")
    .not().isEmpty()
    .withMessage("Time is required"),
  check("type")
    .not().isEmpty()
    .withMessage("Please specify the Type")],
  function (req, res) {
    console.log(currentDate);
    console.log(req.body.date);
    if (req.session.user !== undefined) {
      const errors = validationResult(req).array();
      if (errors.length > 0) {
        let nameErrors = errors.find(val => { return val.param == "name"; });
        let topicErrors = errors.find(val => { return val.param == "topic"; });
        let byErrors = errors.find(val => { return val.param == "by"; });
        let detailsErrors = errors.find(val => { return val.param == "details"; });
        let locationErrors = errors.find(val => { return val.param == "location"; });
        let dateErrors = errors.find(val => { return val.param == "date"; });
        let timeErrors = errors.find(val => { return val.param == "time"; });
        let typeErrors = errors.find(val => { return val.param == "type"; });
        let errorObject = [nameErrors, topicErrors, typeErrors, byErrors, detailsErrors, locationErrors, dateErrors, timeErrors];
        res.render('startNewConnection', {
          errorMessages: errorObject,
          user: req.session.user,
          selectDate: selectDate
        });
      }
      else {
        connectionDB.addConnection(
          req.body.name,
          req.body.topic,
          req.body.by,
          req.body.details,
          req.body.location,
          req.body.date,
          req.body.time,
          req.body.type,
          req.session.user.userId
        ).then(function (newConnection) {
          userProfileDb.addUserConnection("Yes", newConnection, req.session.user.userId);
          res.redirect('/savedConnections');
        }).catch(function (error) {
          console.log(error);
        });
      }
    } else {
      res.render('login', { qs: req.query });
    }
  });

module.exports = router;
