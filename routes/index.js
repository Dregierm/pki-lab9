var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let isLogged =  req.cookies.accessToken ? true : false;
  res.render("index", {isLogged: isLogged});
});

module.exports = router;
