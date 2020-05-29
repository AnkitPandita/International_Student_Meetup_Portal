var userConnectionModel = require('../models/userConnectionModel');
var connectionDb = require("../utilities/connectionDB");

// add / update user connection
var saveUserConnection = async function (rsvp, connectionId, userId) {
  if (rsvp.toUpperCase() == "YES" || rsvp.toUpperCase() == "NO" || rsvp.toUpperCase() == "MAYBE") {
    try {
      var newConnection = await connectionDb.getConnection(connectionId);
      var element = await userConnectionModel.findOne({ userId: userId, connection: newConnection });
      console.log(element);
      if (element) {
        updateConnection(element, rsvp);
      }
      else {
        console.log(rsvp + " " + connectionId + " " + userId);
        addUserConnection(rsvp, newConnection, userId);
      }
    } catch (error) {
      console.log("Error: " + error);
    }
  } else {
    throw new Error('Wrong RSVP status!');
  }
};

var updateConnection = async function (item, rsvpStatus) {
  try {
    await userConnectionModel.updateOne(item, { userRSVP: rsvpStatus });
  } catch (error) {
    console.log("Error while updating: " + error);
  }
};

var addUserConnection = async function (rsvp, connectionDetails, userId) {
  try {
    var newUserConnection = new userConnectionModel({ userId: userId, connection: connectionDetails, userRSVP: rsvp });
    var result = await newUserConnection.save();
    if (result == newUserConnection) {
      console.log("Connection Added");
    }
    else {
      console.log("Connection failed to Add");
    }
  } catch (error) {
    console.log("Error while adding: " + error);
  }
};

// remove user connection
var removeUserConnection = async function (connectionId, userId) {
  try {
    await userConnectionModel.deleteOne({ userId: userId, 'connection.connectionId': connectionId });
  } catch (error) {
    console.log("Error while deleting: " + error);
  }
};

// get user connections
var getUserConnections = async function (userId) {
  try {
    var connArray = await userConnectionModel.find({ userId: userId });
    return connArray;
  } catch (error) {
    console.log("Error while getting connections: " + error);
  }
};

module.exports = {
  removeUserConnection: removeUserConnection,
  saveUserConnection: saveUserConnection,
  addUserConnection: addUserConnection,
  getUserConnections: getUserConnections
};
