import React from "react";
import ReactDOM from "react-dom";
import { IndexRoute, Route, browserHistory, Link, Router } from "react-router";
import Master from "./components/master";
import Login from "./components/login";
import Register from "./components/register";
import ManageVotes from "./components/manage-votes";
import CreatePoll from "./components/createpoll";
import VotesList from "./components/votes-list";
import VotePage from "./components/vote-page";

ReactDOM.render(
    <Router history={browserHistory}>
      <Route path="/" component={Master}>
        <IndexRoute component={VotesList}/>
        <Route path="/vote-page/:id" component={VotePage}/>
        <Route path="/manage" component={ManageVotes}/>
        <Route path="/create" component={CreatePoll}/>
        <Route path="/login" component={Login}/>
        <Route path="/register" component={Register}/> 
      </Route>
    </Router>, document.getElementById("container")
);

