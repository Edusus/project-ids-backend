const path = require('path');
const csv = require('csvtojson');
const csvParser = csv({
  trim: true,
  delimiter: [',', ';', '|', '$', '\t'],
  noheader: false,
  headers: ['playerExternalId', 'points'],
  colParser: {
    "playerExternalId": "string",
    "points": "number"
  }
});

const myFunction = async (csvPath) => {
  csvParser.fromFile(csvPath)
  .then(jsonObject => jsonObject.map(x => console.log(x)));
}

myFunction(path.join(__dirname, 'EjemploExcelARecibir.csv'))