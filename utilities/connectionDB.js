var connectionModel = require("../models/connectionModel");
var lodash = require("lodash");
var { v4: uuidv4 } = require('uuid');

//Function which gets list of connections and groups them by its topic. Grouping done so as to ease the mapping items to view
var getConnections = async function () {
  try {
    var connArray = await connectionModel.find();
    var outputArray = lodash.groupBy(connArray, 'connectionType');
    return outputArray;
  } catch (error) {
    console.log("Error while getting connections: " + error);
  }
};

//Function which gets single connection based on connection id
var getConnection = async function (connectionID) {
  try {
    var connection = await connectionModel.findOne({ connectionId: connectionID });
    return connection;
  } catch (error) {
    console.log("Error while getting connection: " + error);
  }
};

//Function which gets single connection based on connection id
var addConnection = async function (connectionName, connectionTopic, connectionBy, connectionDetails, connectionLocation, connectionDate, connectionTime, connectionType, connectionOwnerId) {
  var newConnection = new connectionModel({
    connectionId: uuidv4(),
    connectionName: connectionName,
    connectionTopic: connectionTopic,
    connectionBy: connectionBy,
    connectionDetails: connectionDetails,
    connectionLocation: connectionLocation,
    connectionDate: connectionDate,
    connectionTime: connectionTime,
    connectionType: connectionType,
    connectionOwnerId: connectionOwnerId
  });
  try {
    var result = await newConnection.save();
    if (result == newConnection) {
      console.log("Connection Added");
      return result;
    }
    else {
      console.log("Connection failed to Add");
    }
  } catch (error) {
    console.log("Error while adding: " + error);
  }
};

module.exports = {
  getConnection: getConnection,
  addConnection: addConnection,
  getConnections: getConnections
};