import React from "react";
import {Button} from "react-bootstrap";
import {Authenticated, NotAuthenticated} from "react-stormpath";
import {Link} from "react-router";

export default class CreatePoll extends React.Component {
    constructor(props) {
        super(props);
    }
    static contextTypes = {
        authenticated: React.PropTypes.bool,
        user: React.PropTypes.object
    };
    componentDidMount = () => {
        fetch("/user", {
            method: "post",
            body: JSON.stringify({
                user: this.context.user.givenName
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
            console.log(res)
        });
    };
    
    render() {
        return (
            <div id="create-page">
              <h3>Use the input boxes below to create a poll</h3>
              <form action="/poll-create" method="POST">
               <div id="question-box">
                <label htmlFor="question">Question: </label>
                <input onChange={this.handleInputs} type="text" id="question" name="question" placeholder="Enter question here" required/>
               </div> 
               <div id="choices-box">
                <label htmlFor="choices">Choices: </label>
                <input name="choices" id="choices" placeholder="Seperate by commas" required></input>
               </div> 
                <button onClick={this.handleSubmit} type="submit">Create Poll</button>
              </form>  
            </div>
        )
    }
}