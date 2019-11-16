const express = require("express");
const dbConnector = require("../model/dbConnector.js")
const bodyparser = require("body-parser");
const router = express.Router();

router.get('/', (req, res) => {
  res.render("index", {layout:false, match:"NO MATCH"})
});

router.post('/', (req,res)=> {
  console.log(req.body);
  handleInput(req.body).then((result)=>{
    res.render("index",{layout: false, match:result.match, "error":result.error});
  });
})

function handleInput(params){
  console.log(params);
  return new Promise((resolve, reject)=>{
    if(params.type === '' || params.token === '' || params.date === '' || params.fromTime === '' || params.fromTime === ''){
      resolve({"error": "Missing data", "match" : false});
    }
    //dbConnector.insertRow(params.type, params.token, params.date, params.time).then(dbConnector.getAll).then(findMatch).then(resolve)
  })
}
function findMatch(dbData, type, userId, date, fromTime, toTime){
  return new Promise((resolve,reject)=>{
    console.log(dbData);
    resolve({"error": "", "match": true});

  })

}

module.exports = router;
