import React from "react";
import {Button} from "react-bootstrap";
import Chart from "chart.js";
import ChartVisual from "./chart";
import Delete from "./delete";
import Comments from "./comments"
import {Link} from "react-router";

export default class VotePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            poll: this.props.pollProp,
            chartData: null,
            showChart: false,
            showUserSpecific: false,
            canVote: true
        }
    }
    static contextTypes = {
        user: React.PropTypes.object
    };
    /*componentDidMount = () => {
        fetch("/poll", {
            method: "get"
        }).then((res) => {
        return res.json()
        }).then((json) => {
            this.setState({
                poll: json.data
            });
        });
    };*/
    handleClick = () => {
        if (!this.state.canVote) {
            document.getElementById("no-vote").textContent = "You have voted already!"
            return;
        }
        let element = document.querySelector('input[name="choice"]:checked');
        if (!element) {
            return;
        }
        fetch("/tallies", {
            method: "POST",
            body: JSON.stringify({data: [this.state.poll.user.question, element.getAttribute("id")]}),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
        return res.json()
        }).then((json) => {
            this.setState({
                chartData: json.data
            });
            this.setState({
                showChart: true
            })
        });
        this.setState({
            canVote: false
        });
    };
    backToHome = () => {
        this.props.changeShowVote();
    }
    render() {
        let pollChoices = null;
        let chart;
        let userElements;
        if (this.state.poll) {
            pollChoices = (<div>
              <p className="question">{this.state.poll.user.question}</p>
              {this.state.poll.user.choices.map((ele, index) => {
                  return (
                      <div key={index}><input className="poll" id={index} type="radio" name="choice" value={[ele, this.state.poll.user.question, index]}/><span>{ele}</span></div>
                  )
              })}
              <button className="vote-options" type="submit" onClick={this.handleClick}>Vote</button>
            </div>);
            this.state.showChart ? chart = <ChartVisual chartData={this.state.chartData} choices={this.state.poll.user.choices}/> : chart = null;
            if (this.context.user) {
                this.context.user.givenName === this.state.poll.user.name ? userElements = <div><Delete className="vote-options" question={this.state.poll.user.question}/></div> : userElements = null;
            }
        }
        return(
            <div>
              <div id="vote-page">
                <h4 id="no-vote"></h4>
                {chart}
                {pollChoices}
                {userElements}
                <button onClick={this.backToHome} className="vote-options">Back to Polls</button>
              </div>
              <div>
                <Comments question={this.state.poll.user.question}/>
              </div>  
            </div>
        )
    }
}
