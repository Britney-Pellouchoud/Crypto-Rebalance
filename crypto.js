function csvToArray(delimiter = ",") {
    const csvFile = document.getElementById("spreadsheet");
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      // this will then display a text file
      let data = reader.result;
      // use split to create an array from csvFileing by delimiter
      const headers = data.slice(0, data.indexOf("\n")).split(delimiter);

      // use split to create an array of each csv value row
      const rows = data.slice(data.indexOf("\n") + 1).split("\n");
      const arr = rows.map(function (row) {
        const values = row.split(delimiter);
        const el = headers.reduce(function (object, header, index) {
          object[header] = values[index];
          return object;
        }, {});
        return el;
      });

      // update the values in the csv with the upper/lower rebalance rate 
      getValues(arr, headers);
    }, false);

    if (csvFile.files[0]) {
      reader.readAsText(csvFile.files[0]);
    }
}

// After data has been loaded and parsed, find the dates where the 
// rebalance changes by more than the input rebalance rate

//{Date: some_date, UnixTimeStamp: time, Value: some_value}

function getValues(valuesList, headers) {

    const upperRate = parseFloat(document.getElementById("upper-rate").value);
    const lowerRate = parseFloat(document.getElementById("lower-rate").value);
    const values = headers[2];
    let rebalances = [];
    
    // Get the first value
    let startPoint = parseFloat(valuesList[0][values]);
    
    for (let i = 0; i < valuesList.length; i++) {

        let currValue = parseFloat(valuesList[i][values]);
        
        let upperThreshold = startPoint + startPoint * upperRate;
        let lowerThreshold = startPoint - startPoint * lowerRate;

        // Compare current value to rebalance rate thresholds
        if (currValue > upperThreshold || currValue < lowerThreshold) {
            startPoint = currValue;
            rebalances.push(valuesList[i]);
        } 
        
    }

    // create the line graph
    lineGraph(valuesList, rebalances, headers);
    console.log(`Rebalances have occurred at ${rebalances}`);

}

// Assume date is a string like "12/2/2019"
// Returns the month in human
function getMonthsFromDates(dates) {
  debugger
  //Array of months that are in the csv
  let monthsIncluded = [];

  for (let d = 0; d < dates.length; d++) {
    const month = "";
    for (let i = 0; i < d.length; i++) {
      if (d[i] == "/") {
        break;
      }
      month += d[i];
    }
    monthsIncluded += month;
    //If we haven't recorded this month as existing in the csv, add it to the list of months
  }
  monthsIncluded = monthsIncluded.filter((item, i, ar) => ar.indexOf(item) === i);

  /*  
  months = {"1": "January",
            "2": "February",
            "3": "March",
            "4": "April",
            "5": "May",
            "6": "June",
            "7": "July",
            "8": "August",
            "9": "September",
            "10": "October",
            "11": "November",
            "12": "December"}
  return months[month];*/
}

function lineGraph(data, rebalances, headers) {
    // clear the previous svg
    d3.select("#line-graph").html(null);

    // set the dimensions and margins of the graph
    let margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    let svg = d3.select("#line-graph")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // add X axis --> it is a date format
    var x = d3.scaleTime()
              .domain(d3.extent(data, function(d) { return d3.timeParse("%m/%d/%Y")(d[headers[0]]); }))
              .range([ 0, width ]);

    svg.append("g")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %Y")));

    // add Y axis
    var y = d3.scaleLinear()
              .domain([0, d3.max(data, function(d) { return +(parseFloat(d[headers[2]])); })])
              .range([ height, 0 ]);

    svg.append("g")
       .call(d3.axisLeft(y));

    // add the line
    svg.append("path")
       .datum(data)
       .attr("fill", "none")
       .attr("stroke", "#274472")
       .attr("stroke-width", 1.5)
       .attr("d", d3.line()
            .x(function(d) { return x(d3.timeParse("%m/%d/%Y")(d[headers[0]]));})
            .y(function(d) { return y(parseFloat((d[headers[2]]))); })
       )

}

function unixToDate(unixTimeStamp) {
    const milliseconds = unixTimeStamp * 1000;
    const dateObject = new Date(milliseconds);
    const humanDateFormat = dateObject.toLocaleString();
    return humanDateFormat;
}

