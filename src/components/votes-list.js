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
    };
    handleHover = (e) => {
        e.target.nextSibling.classList.add("vote-param-hover");
    };
    handleLeave = (e) => {
        e.target.nextSibling.classList.remove("vote-param-hover");
    };
    render() {
        console.log(localStorage.getItem("token"))
        let pollData = Array.isArray(this.state.polls) ? this.state.polls.map((ele, index) => {
            return (
            <div id={index} key={index + 1} onClick={() => this.handleClick(index)} className="pollbox">
              <h3 className="poll-title">{ele.user.question}</h3>
              <div className="vote-param expand">
                <div className="expand-inner">  
                  <h4 className="user-name">By {ele.user.name}</h4>
                  <h5 className="vote-date">{ele.date}</h5>
                  <h6 className="vote-num">{ele.votes.reduce(addChoices)} Vote(s)</h6>
                </div>  
              </div>
            </div>
            )
        }) : this.state.polls;
        return (
            <div id="votelist-cont">
              {this.state.showVote ? <VotePage changeShowVote={this.changeShowVote} pollProp={this.state.pollProp}/> : null}
              {this.state.showVote ? null : pollData}
            </div>
        )
    }
}