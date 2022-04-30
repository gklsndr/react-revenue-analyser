import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import { BarSeries, CandlestickSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";
import { filterLOB } from "./utils";

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

class CandleStickStockScaleChartWithVolumeBarV1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selLOB: "LOB-1",
      // initData : props.data,
      chartData: filterLOB(props.data, "LOB-1"),
      lobList: [
        ...new Set(
          props.data.map((d) => {
            return d.line_of_business;
          })
        )
      ]
    };

    this.updateLOB = this.updateLOB.bind(this);
  }

  updateLOB(eventData) {
    this.setState({
      selLOB: eventData.target.value,
      chartData: filterLOB(this.props.data, eventData.target.value)
    });

    console.log(eventData.target.value);
  }
  render() {
    console.log("Props:", this.props);
    const { type, width, ratio } = this.props;

    const initialData = this.state.chartData;
    console.log("filtered state", initialData);
    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
      (d) => d.date
    );
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
      initialData
    );
    console.log("data:", data);
    const start = xAccessor(last(data));
    const end = xAccessor(data[Math.max(0, data.length - 100)]);
    const xExtents = [start, end];

    return (
      <div>
        <div className="toolbar">
          <Select
            value={this.state.selLOB}
            onChange={this.updateLOB}
            MenuProps={MenuProps}
            inputProps={{ "aria-label": "Without label" }}
          >
            {this.state.lobList.map((name) => (
              <MenuItem key={name} value={name} classes="chartItem">
                {name}
              </MenuItem>
            ))}
          </Select>
        </div>
        <ChartCanvas
          height={400}
          ratio={ratio}
          width={width}
          margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
          type={type}
          seriesName="MSFT"
          data={data}
          xScale={xScale}
          xAccessor={xAccessor}
          displayXAccessor={displayXAccessor}
          xExtents={xExtents}
        >
          <Chart id={1} yExtents={(d) => [d.high, d.low]}>
            <XAxis axisAt="bottom" orient="bottom" />
            <YAxis axisAt="right" orient="right" ticks={5} />
            <CandlestickSeries />
          </Chart>
          <Chart id={2} yExtents={(d) => d.revenue}>
            <YAxis
              axisAt="left"
              orient="left"
              ticks={5}
              tickFormat={format(".2s")}
            />
            <BarSeries yAccessor={(d) => d.revenue} />
          </Chart>
        </ChartCanvas>
      </div>
    );
  }
}

CandleStickStockScaleChartWithVolumeBarV1.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["svg", "hybrid"]).isRequired
};

CandleStickStockScaleChartWithVolumeBarV1.defaultProps = {
  type: "svg"
};
CandleStickStockScaleChartWithVolumeBarV1 = fitWidth(
  CandleStickStockScaleChartWithVolumeBarV1
);

export default CandleStickStockScaleChartWithVolumeBarV1;
