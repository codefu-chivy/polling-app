import React from "react";
import {Button} from "react-bootstrap";
import Delete from "./delete";

export default class ManageVotes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            polls: null
        }
    }
    static contextTypes = {
        user: React.PropTypes.object
    };
    componentDidMount = () => {
        fetch("/manage-votes", {
            method: "post",
            body: JSON.stringify({
                user: this.context.user.givenName
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
        return res.json()
        }).then((json) => {
            console.log(json)
            this.setState({
                polls: json.data
            });
        });
    };
    render() {
        let pollData = Array.isArray(this.state.polls) ? this.state.polls.map((ele, index) => {
            return (
            <div key={index} className="list-link">
              <h3 className="poll-title" id={index}>{ele.user.question}</h3>
              <h4 id={index}>By {ele.user.name}</h4>
              <h5 id={index}>{ele.date}</h5>
              <Delete question={ele.user.question}/>
            </div>
            )
        }) : (<div><h3>You have no polls</h3></div>);
        return (
            <div>
              {pollData}
            </div>
        )
    }
}