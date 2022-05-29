
function csvToArray(delimiter = ",") {
    const csvFile = document.getElementById('spreadsheet');
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      debugger
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

      // return the array
      return arr;
    }, false);

    if (csvFile.files[0]) {
      reader.readAsText(csvFile.files[0]);
    }
  }

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