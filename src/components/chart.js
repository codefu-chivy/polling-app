import React from "react";
import Chart from "chart.js";

export default class ChartVisual extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount = () => {
        const colors = ["#FF0000", "#FFD700", "#00FFFF", "#00FF00", "#800080", "#FF00FF", "#0000FF", "#9ACD32", "#808080", "#00CED1", "#D2691E"];
        let chartColors = colors.slice(0, this.props.choices.length);
        Chart.defaults.global.responsive = false;
        const data = {
            labels: this.props.choices,
                datasets: [{
                    data: this.props.chartData,
                    fillColor: chartColors,
                    backgroundColor: chartColors,
                    hoverBackgroundColor: chartColors
                }]
        }
        let ctx = document.getElementById("dataChart");
        let chart = new Chart(ctx, {
            type: "doughnut",
            data: data
        });
    }
    render() {
        return (
        <div>
          <canvas id="dataChart"></canvas>
        </div>
        )
    }
}