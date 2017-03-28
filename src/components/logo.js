import React from "react";
import {Link} from "react-router";

export default class Logo extends React.Component {
    render() {
        return (
            <div>
              <a href="/"><img id="logo" src="../static/chart.png" alt="Poller Logo" title="logo"/>
              <h2 id="pollers">Pollers</h2></a>
            </div>
        )
    }
}