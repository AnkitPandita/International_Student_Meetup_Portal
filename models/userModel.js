var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "required"]
  },
  UserFirstName: {
    type: String,
    required: [true, "required"]
  },
  UserLastName: {
    type: String,
    required: [true, "required"]
  },
  UserEmail: {
    type: String,
    required: [true, "required"]
  },
  UserPassword: {
    type: String,
    required: [true, "required"]
  }
}, { collection: 'users' });

module.exports = mongoose.model("User", userSchema);