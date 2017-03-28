import React from "react";
import {Button} from "react-bootstrap";
import {Link} from "react-router";

export default class Default extends React.Component {
    constructor(props) {
        super(props);
    }
    handleDelete = () => {
        fetch("/delete-poll", {
            method: "post",
            body: JSON.stringify({
                question: this.props.question
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
            return res.json();
        }).then((json) => {
            console.log(json);
            window.location = json.redirect;
        });
    };
    render() {
        return (
            <div>
              <button onClick={this.handleDelete}>Delete</button>
            </div>
        )
    }
}
