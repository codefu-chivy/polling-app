const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pollSchema = new Schema({
    user: {
        name: String,
        question: String,
        choices: Array
    },
    date: String,
    votes: Array,
    comments: Array,
    userFeedback: Array
})

let Poll = mongoose.model("Poll", pollSchema);

module.exports = Poll;