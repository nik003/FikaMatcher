const express = require("express");
const dbConnector = require("../model/dbConnector.js")
const bodyparser = require("body-parser");
const router = express.Router();

router.get('/', (req, res) => {
  res.render("index", {
    layout: false,
    match: "NO MATCH"
  })
});

router.post('/', (req, res) => {
  handleInput(req.body).then((result) => {
    if(result.match){
      res.render("match",{layout: false, "matchName":result.matchName});
    }else{
      res.render("index", {
        layout: false,
        match: result.match,
        "error": "No match found, please wait until another person contacts you"
      });
    }
  });
})

function handleInput(params) {
  return new Promise((resolve, reject) => {
    if (params.type === '' || params.token === '' || params.date === '' || params.fromTime === '' || params.fromTime === '' || params.userId === '') {
      resolve({
        "error": "Missing data",
        "match": false
      });
    }
    dbConnector.insertRow(params).then(dbConnector.getAll).then(findMatch).then(resolve)
  })
}

function findMatch(data) {
  return new Promise((resolve, reject) => {
    console.log(data.dbData.recordset[0]);
    for (var i = 0; i < data.dbData.recordset.length; i++) {
      var dbObj = data.dbData.recordset[i];
      var fromDate1 = new Date(dbObj.timeFrom).getTime();
      var toDate1 = new Date(dbObj.timeTo).getTime();
      var fromDate2 = new Date(data.params.start_time).getTime();
      var toDate2 = new Date(data.params.end_time).getTime();
      if ((fromDate1 <= fromDate2 && toDate1 >= fromDate2) || (fromDate2 <= fromDate1 && toDate2 >= fromDate1)) {
        if (dbObj.userId != data.params.userId) {
          resolve({
            "error": "",
            "match": true,
            "matchName":dbObj.userId

          });
        }
      }
    }
    resolve({
      "error": "",
      "match": false
    });
  })
}

module.exports = router;
