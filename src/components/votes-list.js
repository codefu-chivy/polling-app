import React from "react";
import VotePage from "./vote-page";

let addChoices = (total, num) => {
    return total + num;
}

export default class VotesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            polls: null, 
            pollProp: null,
            showVote: false
        }
    }
    componentDidMount = () => {
        fetch("/votes-list", {
            method: "get"
        }).then((res) => {
        return res.json()
        }).then((json) => {
            console.log(json.data)
            if (json.data.length === 0) {
                this.setState({
                    polls: "Looks like there aren't any polls open yet. Sign in, or register to start your own poll."
                });
            }
            else {
                this.setState({
                    polls: json.data
                });
            }
        });
    };
    handleClick = (indexNum) => {
        this.setState({
            pollProp: this.state.polls[indexNum],
            showVote: true
        });
    };
    changeShowVote = () => {
        this.setState({
            showVote: false
        });
    }
    render() {
        let pollData = Array.isArray(this.state.polls) ? this.state.polls.map((ele, index) => {
            return (
            <div key={index + 1} onClick={() => this.handleClick(index)} className="pollbox">
              <h3 className="poll-title" id={index}>{ele.user.question}</h3>
              <h4>By {ele.user.name}</h4>
              <h5>{ele.date}</h5>
              <h6>{ele.votes.reduce(addChoices)} Vote(s)</h6>
            </div>
            )
        }) : this.state.polls;
        return (
            <div>
              {this.state.showVote ? <VotePage changeShowVote={this.changeShowVote} pollProp={this.state.pollProp}/> : null}
              {this.state.showVote ? null : pollData}
            </div>
        )
    }
}