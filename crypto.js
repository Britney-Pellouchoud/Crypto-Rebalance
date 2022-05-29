
const reader = new FileReader();
reader.onload = function (event) {
    console.log(event.target.result); // the CSV content as string
  };

reader.readAsText(file);


function csvToArray(delimiter = ",") {
    debugger
    let csvFile = document.getElementById('spreadsheet');

    // use split to create an array from csvFileing by delimiter
    const headers = csvFile.slice(0, csvFile.indexOf("\n")).split(delimiter);

    // use split to create an array of each csv value row
    const rows = csvFile.slice(csvFile.indexOf("\n") + 1).split("\n");
    const arr = rows.map(function (row) {
      const values = row.split(delimiter);
      const el = headers.reduce(function (object, header, index) {
        object[header] = values[index];
        return object;
      }, {});
      return el;
    });

    // return the array
    return arr;
  }

 
reader.onload = function (e) {
    const text = e.target.result;
    const data = csvToArray(text);
    document.write(JSON.stringify(data));
    };
    


// After data has been loaded and parsed, find the dates where the 
// rebalance changes by more than the input rebalance rate

function getValues(valuesList, upperRate, lowerRate) {
    
    const startPoint = valuesList[0];
    
    for (let i = 0; i < valuesList.length; i++) {
        
        const rebalances = [];
        const currValue = valuesList[i];
        
        const upperThreshold = startPoint + startPoint * upperRate;
        const lowerThreshold = startPoint - startPoint * lowerRate;

        if (currValue > upperThreshold || currValue < lowerThreshold) {
            startPoint = currValue;
            rebalances.push(currValue);
        } 
        
    }

    console.log(`Rebalances have occurred at ${rebalances}`);

}