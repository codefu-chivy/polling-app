import React from "react";
import {Link} from "react-router";
import {LoginLink} from "react-stormpath";
import DocumentTitle from "react-document-title";
import Header from "./header";

export default class Master extends React.Component {
    render() {
        return (
            <DocumentTitle title="Pollers: Put It to A Vote">
              <div className="master">
                <Header/>
                {this.props.children}
              </div>
            </DocumentTitle>    
        )
    }
}