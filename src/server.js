const express = require("express");
const stormpath = require("express-stormpath");
const bodyParser = require("body-parser");
const webpack = require("webpack");
const config = require("../webpack.config");
const path = require("path");
const urlencodedParser = bodyParser.urlencoded({extended: false});
const jsonParser = bodyParser.json();
const dbconnection = require("./database/dbconnection");
const Poll = require("./database/poll-model");
const Index = require("./database/number-model");
const port = process.env.PORT || 8080
let username;
let pollNumber;
require("dotenv").config({path: "codes.env"})

dbconnection();
const app = express();
const compiler = webpack(config);

app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.use(stormpath.init(app, {
    client: {
        apiKey: {
            id: process.env.API_ID,
            secret: process.env.API_SECRET
        }
    },
    application: {
        href: process.env.APP_HREF
    },
    web: {
        produces: ["application/json"]
    }
}));

app.use("/static", express.static(path.join(__dirname, 'static')));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/static/index.html");
})

app.on("stormpath.ready", () => {
    app.listen(port, (err) => {
        if (err) {
            throw err;
        }
        console.log("Listening on port 3000");
    });
});

app.post("/poll-create", urlencodedParser, (req, res) => {
    let votesArray = [];
    let question = req.body.question;
    let choices = req.body.choices.split(",");
    for (let i = 0; i < choices.length; i++) {
        votesArray[i] = 0;
    }
    let date = new Date();
    let dateString = date.toLocaleString();
    console.log(dateString);
    let userPoll = new Poll({
        user: {
            name: username,
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
        console.log("Successful save");
        res.redirect("/");
    });
});

app.post("/user", jsonParser, (req, res) => {
    username = req.body.user;
    res.sendStatus(200);
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
})
