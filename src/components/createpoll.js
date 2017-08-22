import React from "react";
import {Button} from "react-bootstrap";
import {Link} from "react-router";
import jwt_decode from "jwt-decode";

export default class CreatePoll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: localStorage.getItem("token")
        }
    }
    handleCreatePoll = () => {
        let question = document.getElementById("question").value;
        let choices = document.getElementById("choices").value;
        let username = jwt_decode(JSON.stringify(this.state.token))._doc.username;
        let data = {
            question: question,
            choices: choices,
            username: username
        }
        fetch("poll-create", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then((res) => {
            return res.json();
        }).then((json) => {
            if (json.success === true) {
                window.location = "/";
            }
            else {
                alert("Not enough choices!");
            }
        });
    }
    render() {
        return (
            <div id="create-page">
              <h3>Use the input boxes below to create a poll</h3>
               <div id="question-box">
                <label htmlFor="question">Question: </label>
                <input onChange={this.handleInputs} type="text" id="question" name="question" placeholder="Enter question here" required/>
               </div> 
               <div id="choices-box">
                <label htmlFor="choices">Choices: </label>
                <input name="choices" id="choices" placeholder="Seperate by commas" required></input>
               </div> 
                <button id="create-poll-button" onClick={this.handleCreatePoll}>Create Poll</button>
            </div>
        )
    }
}