import React from "react";
import ReactDOM from "react-dom";
import { IndexRoute, Route, browserHistory, Link } from "react-router";
import ReactStormpath, { Router, HomeRoute, LoginRoute, AuthenticatedRoute } from "react-stormpath";
import Master from "./components/master";
import Login from "./components/login";
import Register from "./components/register";
import ManageVotes from "./components/manage-votes";
import CreatePoll from "./components/createpoll";
import VotesList from "./components/votes-list";
import VotePage from "./components/vote-page";
import Change from "./components/change";

ReactStormpath.init({
  endpoints: {
    baseUri: "https://alien-fission.apps.stormpath.io"
  }
});

ReactDOM.render(
    <Router history={browserHistory}>
      <HomeRoute path="/" component={Master}>
        <IndexRoute component={VotesList}/>
        <Route path="/vote-page/:id" component={VotePage}/>
        <Route path="/manage" component={ManageVotes}/>
        <Route path="/forgot" component={Change}/>
        <AuthenticatedRoute path="/create" component={CreatePoll}/>
        <LoginRoute path="/login" component={Login}/>
        <Route path="/register" component={Register}/> 
      </HomeRoute>
    </Router>, document.getElementById("container")
);

