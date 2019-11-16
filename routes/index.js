const express = require("express");
const dbConnector = require("../model/dbConnector.js")
const bodyparser = require("body-parser");
const router = express.Router();

router.get('/', (req, res) => {
  res.render("index", {layout:false, match:"NO MATCH"})
});

router.post('/', (req,res)=> {
  console.log(req.body);
  res.render("index",{layout: false, match:"POSTED"});
})

function handleInput(params){
  dbConnector.insertRow()

}
module.exports = router;
