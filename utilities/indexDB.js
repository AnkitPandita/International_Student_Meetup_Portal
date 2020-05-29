//creating a database and connecting it to mongoose
var mongoose = require("mongoose");

var intializeDb = function () {
  try {
    mongoose.connect("mongodb://localhost/ProjectNBAD", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    var db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function () {
      // we're connected!
      console.log("Connection Open!");
    });
  } catch (error) {
    console.log("Error establishing database connection: " + error);
  }
};

module.exports = {
  intializeDatabase: intializeDb
};