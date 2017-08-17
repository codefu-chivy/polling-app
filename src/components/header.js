import React from "react";
import {Link, Router} from "react-router";
import Logo from "./logo";
import {Button} from "react-bootstrap";

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: localStorage.getItem("token")
        }
    }
    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired,
        };
    };
    handleLogout = () => {
        localStorage.removeItem("token");
        this.setState({
            isAuthenticated: false
        });
        window.location = "/";
    }
    createPoll = () => {
        let auth = "/create";
        let notAuth = "/login";
        this.state.isAuthenticated ? this.context.router.push(auth) : this.context.router.push(notAuth);
    }
    render() {
        let user;        
        return (
            <div className="head">
              <nav className="first-block">
                <Logo/>
                <ul>
                  {this.state.isAuthenticated ? <li><Link to="/manage"><button id="manage" className="userButtons">Manage Votes</button></Link></li> : null}
                  {this.state.isAuthenticated ? null : <li><Link to="/login"><button id="login-link" className="userButtons">Login</button></Link></li>}
                  {this.state.isAuthenticated ? null : <li><Link to="/register"><button id="register-link" className="userButtons">Sign Up</button></Link></li>}
                  {this.state.isAuthenticated ? <li><button id="logout-link" onClick={this.handleLogout} className="userButtons">Logout</button></li> : null}
                </ul>  
              </nav>
              <img id="main" src="/static/main-image.jpg" alt="main image" title="main image"/>
              <h1 id="slogan">Put It To A Vote</h1>
              <button onClick={this.createPoll} id="create">Create New Poll</button>
              {user}
            </div>
        );
    }
}