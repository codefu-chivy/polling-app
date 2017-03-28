module.exports = function() {
    const mongoose  = require("mongoose");
    const uri = process.env.POLLURI;
    mongoose.Promise = global.Promise;
    mongoose.connect(uri);
}    
