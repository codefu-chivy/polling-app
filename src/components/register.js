import React from "react";
import DocumentTitle from "react-document-title";
import {Link} from "react-router";
import {Router, Redirect} from "react-router";

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            pass: "",
            username: "",
            notValid: null,
            exists: false
        }
    }
    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired,
        };
    }
    handleEmail = () => {
        let email = document.getElementById("email").value;
        fetch("/valid-email", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email: email})
        }).then((res) => {
            return res.json();
        }).then((json) => {
            let message;
            if (json.message) {
                message = json.message;
            }
            else {
                if (!json.valid) {
                    message = "Invalid Address";
                }
            }
            if (message) {
                this.setState({
                    notValid: message
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            notValid: null
                        });
                    }, 2500);
                });
            }
            else {
                this.setState({
                    exists: true
                });
            }
        });
    }
    handleUserPass = (e) => {
        if (this.state.exists) {
            return;
        }
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        let email = document.getElementById("email").value;
        if (!email || !password || !username) {
            return;
        }
        if (password.length < 6) {
            this.setState({
                notValid: "Password length too short!"
            }, () => {
                setTimeout(() => {
                    this.setState({ notValid: null })
                }, 2500);
            });
            return;
        }
        let data = {
            username: username,
            password: password,
            email: email
        };
        fetch("/handle-register", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }).then((res) => {
            return res.json();
        }).then((json) => {
            if (json.message) {
                this.setState({
                    notValid: json.message
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            notValid: null
                        });
                    }, 2500);
                });
            }
            if (json.success) {
                this.context.router.push("/login");
            }    
        })
    }
    render() {
        return (
            <DocumentTitle title="Registration Form">
              <div id="register">
                <div id="inner-register">  
                <p><label htmlFor="email">Email: </label>
                <input onBlur={this.handleEmail} type="email" name="email" id="email" placeholder="Enter email"/></p>
                <p><label htmlFor="username">Username: </label>
                <input type="text" name="username" id="username" placeholder="Choose a username"/></p> 
                <p><label htmlFor="password">Password: </label>
                <input type="password" name="password" id="password" placeholder="Enter a password"/></p>
                <button id="register-button" onClick={this.handleUserPass}>Register</button>
                <p id="not-valid">{this.state.notValid}</p>
                </div>
              </div>
            </DocumentTitle>
        );
    }
}
