import React from "react";
import { render } from "react-dom";
import Chart from "./Chart";
import { getData, transformTimeseriesData } from "./utils";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import revenueData from "../public/data.js";
import "../public/styles.css";
import ReactVirtualizedTable from "./Table";

const chartTypes = [
  "Revenue & ACV timeline (All Products)",
  "Revenue & TCV timeline",
  "ACV vs TCV"
];

class ChartComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedChart: chartTypes[0],
      chartData: null
    };

    this.updateChartType = this.updateChartType.bind(this);
  }

  updateChartType(eventData) {
    // this.state.selectedChart = eventData.target.value;
    this.setState({ selectedChart: eventData.target.value });
    console.log("Chart Selected", eventData.target.value);
  }

  componentDidMount() {
    let revenueSeriesData = transformTimeseriesData(revenueData);
    this.setState({ chartData: revenueSeriesData });
    console.log("Series Data:", revenueSeriesData);
    getData().then((data) => {
      // this.setState({ chartData: data });
      console.log("Sample chart data", data);
    });
  }

  render() {
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250
        }
      }
    };

    return (
      <div className="appRoot">
        <div className="header">
          <Select
            value={this.state.selectedChart}
            onChange={this.updateChartType}
            MenuProps={MenuProps}
            inputProps={{ "aria-label": "Without label" }}
          >
            {chartTypes.map((name) => (
              <MenuItem key={name} value={name} classes="chartItem">
                {name}
              </MenuItem>
            ))}
          </Select>
          Hi Bruce Wayne
        </div>
        {!this.state.chartData && <div>Loading...</div>}

        {this.state.chartData && (
          <div className="dataContainer">
            <Chart data={this.state.chartData} />
            {ReactVirtualizedTable(this.state.chartData)}
          </div>
        )}
      </div>
    );
  }
}

render(<ChartComponent />, document.getElementById("root"));
