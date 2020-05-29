var mongoose = require("mongoose");

var userConnectionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "required"]
  },
  connection: {
    type: Object,
    required: [true, "required"]
  },
  userRSVP: {
    type: String,
    required: [true, "required"]
  }
}, { collection: 'userConnections' });

module.exports = mongoose.model("UserConnection", userConnectionSchema);