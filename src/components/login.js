import React from "react";
import DocumentTitle from "react-document-title";
import Logo from "./logo";
import {Link, Router} from "react-router";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            incorrect: null
        }
    }
    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired,
        };
    };
    handleLogin = () => {
        let username = document.getElementById("login-username").value;
        let password = document.getElementById("login-password").value;
        fetch("/handle-login", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: username, password: password})
        }).then((res) => {
            return res.json();
        }).then((json) => {
            if (json.incorrect) {
                this.setState({
                    incorrect: "Invalid password or username"
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            incorrect: null
                        });
                    }, 2500);
                });
            }
            else {
                sessionStorage.setItem("token", JSON.stringify({token: json.token}));
                window.location = "/";
            }
        });
    }
    render() {
        return (
            <DocumentTitle title="Login">
                <div id="login">
                    <p><label htmlFor="username">Username: </label>
                    <input type="text" name="username" id="login-username" placeholder="Enter username"/></p>
                    <p><label htmlFor="password">Password: </label>
                    <input type="password" name="password" id="login-password" placeholder="Enter password"/></p>
                    <button id="login-button" onClick={this.handleLogin}>Login</button>
                    <p id="not-reg">Not registered yet? Create an account <Link to="/register">here</Link></p>
                    <p id="incorrect">{this.state.incorrect}</p>
                </div>
            </DocumentTitle>
        )
    }
}