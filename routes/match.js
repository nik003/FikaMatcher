const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
  res.render("index", {"layout":false, "dynamisk":"apa"})
});
module.exports = router;
