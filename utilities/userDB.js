var userModel = require('../models/userModel');

var getUsers = async function getAllUsers() {
  try {
    return await userModel.find();
  } catch (error) {
    console.log("Error while getting users: " + error);
  }
};

var getSpecificUserData = async function (userEmail, userPassword) {
  try {
    return await userModel.findOne({ UserEmail: userEmail, UserPassword: userPassword });
  } catch (error) {
    console.log("Error while getting user: " + error);
  }
};

module.exports = {
  getSpecificUserData: getSpecificUserData,
  getUsers: getUsers
};
