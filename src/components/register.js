import React from "react";
import {RegistrationForm} from "react-stormpath";
import DocumentTitle from "react-document-title";

export default class Register extends React.Component {
    render() {
        return (
            <DocumentTitle title="Registration Form">
              <div>
                <RegistrationForm id="register"/>
              </div>
            </DocumentTitle>
        );
    }
}
