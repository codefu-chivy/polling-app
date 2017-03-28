import React from "react";
import {Link} from "react-router";
import Logo from "./logo";
import {LoginLink, LogoutLink, Authenticated, NotAuthenticated} from "react-stormpath";
import {Button} from "react-bootstrap";

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false
        }
    }
    static contextTypes = {
        authenticated: React.PropTypes.bool,
        user: React.PropTypes.object
    };
    render() {
        let user;
        if (this.context.authenticated) {
            user = <div id="greeting"><h3>Hello, {this.context.user.givenName}</h3></div>
        }
        else {
            user = null;
        }
        return (
            <div className="head">
              <nav className="first-block">
                <Logo/>
                <ul>
                  <Authenticated>
                    <li id="manage"><Link to="/manage">Manage Votes</Link></li>
                  </Authenticated>
                  <NotAuthenticated>
                    <li><LoginLink/></li>
                  </NotAuthenticated>
                  <NotAuthenticated>
                    <li><Link to="/register">Sign Up</Link></li>
                  </NotAuthenticated>
                  <Authenticated>
                    <li id="logout-link"><LogoutLink/></li>
                  </Authenticated>
                </ul>  
              </nav>
              <img id="main" src="/static/main-image.jpg" alt="main image" title="main image"/>
              <h1 id="slogan">Put It To A Vote</h1>
              <Link to="/create"><Button id="create" bsSize="large">Create New Poll</Button></Link>
              {user}
            </div>
        );
    }
}