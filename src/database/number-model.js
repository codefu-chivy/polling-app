const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const numSchema = new Schema({
    index: Number
});

let Index = mongoose.model("Index", numSchema);

module.exports = Index;