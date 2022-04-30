import { tsvParse, csvParse } from "d3-dsv";
import { timeParse } from "d3-time-format";

function parseData(parse) {
  return function (d) {
    d.date = parse(d.date);
    d.open = +d.open;
    d.high = +d.high;
    d.low = +d.low;
    d.close = +d.close;
    d.volume = +d.volume;

    return d;
  };
}

const parseDate = timeParse("%Y-%m-%d");

export function getData() {
  const promiseMSFT = fetch(
    "https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/MSFT.tsv"
  )
    .then((response) => response.text())
    .then((data) => tsvParse(data, parseData(parseDate)));
  return promiseMSFT;
}

export function transformTimeseriesData(data) {
  // console.log("Revenue data", data);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  let sumAcv = 0;
  let seriesData = data.map((d) => {
    d.date = new Date(d.year, monthNames.indexOf(d.month));
    d.dateString = d.month.slice(0, 3) + " - " + d.year;
    d.open = sumAcv;
    d.low = sumAcv;
    sumAcv += d.acv;
    d.sumAcv = sumAcv;
    d.high = sumAcv;
    d.close = sumAcv;

    return d;
  });
  // console.log("series data", seriesData);
  return seriesData;
}

export function filterLOB(data, lob) {
  let filteredValues = data.filter((d) => {
    return d.line_of_business === lob;
  });
  console.log("Filtered values", filteredValues);

  return filteredValues;
}
