const express = require("express");
const bodyParser = require("body-parser");
const webpack = require("webpack");
const config = require("../webpack.config");
const path = require("path");
const urlencodedParser = bodyParser.urlencoded({extended: false});
const jsonParser = bodyParser.json();
const dbconnection = require("./database/dbconnection");
const Poll = require("./database/poll-model");
const User = require("./database/user-model");
const port = process.env.PORT || 3000;
const Isemail = require("isemail");
const passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");
let username;
let pollNumber;
require("dotenv").config({path: "codes.env"})

dbconnection();
console.log("here")
const app = express();
const compiler = webpack(config);

app.use("/static", express.static(path.join(__dirname, 'static')));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/static/index.html");
})

app.post("/poll-create", jsonParser, (req, res) => {
    let votesArray = [];
    let question = req.body.question;
    let choices = req.body.choices.split(",");
    for (let i = 0; i < choices.length; i++) {
        votesArray[i] = 0;
    }
    let date = new Date();
    let dateString = date.toLocaleString();
    dateString = dateString.slice(0, dateString.indexOf(","));
    let userPoll = new Poll({
        user: {
            name: req.body.username,
            question: question,
            choices: choices,
        },
        date: dateString,
        votes: votesArray,
        comments: [],
        userFeedback: []
    });
    userPoll.save((err) => {
        if (err) {
            throw err;
        }
    }).then(() => {
        res.json({success: true});
    });
});

app.get("/votes-list", (req, res) => {
    let resJSON;
    Poll.find({}, (err, pollData) => {
        if (err) {
            throw err;
        }
        pollData ? resJSON = {data: pollData.reverse()} : resJSON = {data: null};
        res.json(resJSON);
    });
});

app.post("/comments", jsonParser, (req, res) => {
    Poll.findOne({"user.question": req.body.data}, (err, userPoll) => {
        if (err) {
            throw err;
        }
        res.json({comments: userPoll.comments});
    });
});

app.post("/create-comment", jsonParser, (req, res) => {
    let date = new Date().toLocaleString();
    Poll.findOne({"user.question": req.body.data[1]}, (err, userPoll) => {
        userPoll.comments.unshift({comment: req.body.data[0], date: date});
        userPoll.save((err) => {
            if (err) {
                throw err;
            }
            res.json({newComments: userPoll.comments})
        });
    });
});

app.post("/tallies", jsonParser, (req, res) => {
    Poll.findOne({"user.question": req.body.data[0]}, (err, userPoll) => {
        userPoll.votes[req.body.data[1]]++;
        userPoll.markModified("votes");
        userPoll.save((err) => {
            if (err) {
                throw err;
            }
        });
        res.json({data: userPoll.votes});
    });
});

app.post("/delete-poll", jsonParser, (req, res) => {
    Poll.findOne({"user.question": req.body.question}, (err, userPoll) => {
        if (err) {
            throw err;
        }
        userPoll.remove((err) => {
            if (err) {
                throw err;
            }
            res.json({"redirect": "/"});
        })
    });
});

app.post("/manage-votes", jsonParser, (req, res) => {
    Poll.find({"user.name": req.body.user}, (err, polls) => {
        if (err) {
            throw err;
        }
        res.json({data: polls})
    })
});

app.post("/valid-email", jsonParser, (req, res) => {
    let isValid = Isemail.validate(req.body.email);
    if (!isValid) {
        res.json({valid: isValid});
    }
    else {
        User.findOne({email: req.body.email}, (err, email) => {
            if (!email) {
                res.json({valid: isValid});
            }
            else {
                res.json({message: "Email already exists"});
            }
        });
    }  
});

app.post("/handle-register", jsonParser, (req, res) => {
    User.findOne({username: req.body.username}, (err, username) => {
        if (username) {
            res.json({message: "This username already exists. Choose another"});
        }
        else {
            console.log("here")
            let hashedPassword = passwordHash.generate(req.body.password);
            let username = req.body.username;
            let email = req.body.email;
            let users = new User({
                username: username,
                password: hashedPassword,
                email: email
            });
            users.save((err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.json({success: true});
                }
            });
        }
    });
});

app.post("/handle-login", jsonParser, (req, res) => {
    User.findOne({username: req.body.username}, (err, userObj) => {
        if (err) {
            throw err;
        }
        if (userObj) {
            if (passwordHash.verify(req.body.password, userObj.password)) {
                let token = jwt.sign(userObj, process.env.SECRET, {expiresIn: 1440});
                res.json({token: token});
            }
            else {
                res.json({incorrect: true});
            }
        }
        else {
            res.json({incorrect: true});
        }
    });
})

app.listen(port, (err) => {
    if (err) {
        throw err;
    }
    console.log("Listening on port 3000");
});
