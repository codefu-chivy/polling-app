import React from "react";
import DocumentTitle from "react-document-title";
import {LoginForm} from "react-stormpath";
import Logo from "./logo";
import {Link} from "react-router";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div id="login">
            <LoginForm/>
            <p>Not registered yet? Create an account <Link to="/register">here</Link></p>
            </div>
        )
    }
}