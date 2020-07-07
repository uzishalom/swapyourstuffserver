var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.status(404).send("*** 404 NOT FOUND 404 ***");
});

module.exports = router;
