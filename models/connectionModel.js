var mongoose = require("mongoose");

var connectionSchema = new mongoose.Schema({
    connectionId: {
        type: String,
        required: [true, "required"]
    },
    connectionName: {
        type: String,
        required: [true, "required"]
    },
    connectionTopic: {
        type: String,
        required: [true, "required"]
    },
    connectionBy: {
        type: String,
        required: [true, "required"]
    },
    connectionDetails: {
        type: String,
        required: [true, "required"]
    },
    connectionLocation: {
        type: String,
        required: [true, "required"]
    },
    connectionDate: {
        type: String,
        required: [true, "required"]
    },
    connectionTime: {
        type: String,
        required: [true, "required"]
    },
    connectionType: {
        type: String,
        required: [true, "required"]
    },
    connectionOwnerId: {
        type: String,
        required: [true, "required"]
    },
    connectionImg: String
}, { collection: 'connections' });

module.exports = mongoose.model("Connections", connectionSchema);