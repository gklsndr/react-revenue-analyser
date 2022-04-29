import React from "react";
import { render } from "react-dom";
import Chart from "./Chart";
import { getData } from "./utils";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import revenueData from "../public/data.js";
import "../public/styles.css";
import ReactVirtualizedTable from "./Table";

class ChartComponent extends React.Component {
  componentDidMount() {
    getData().then((data) => {
      this.setState({ data });
      console.log(data);
    });
  }
  render() {
    const chartTypes = [
      "Revenue & ACV timeline",
      "Revenue & TCV timeline",
      "ACV vs TCV"
    ];
    this.selectedChart = chartTypes[0];
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

    function handleChange(eventData) {
      this.selectedChart = eventData.target.value;
      console.log("Chart Selected", eventData.target.value);
    }

    return (
      <div className="appRoot">
        <div className="header">
          <Select
            value={this.selectedChart}
            onChange={handleChange}
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
        {!this.state && <div>Loading...</div>}

        {this.state && (
          <div>
            <Chart data={this.state.data} />
            {ReactVirtualizedTable(revenueData)}
          </div>
        )}
      </div>
    );
  }
}

render(<ChartComponent />, document.getElementById("root"));
