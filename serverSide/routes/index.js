var express = require('express');
var router = express.Router();
var port = 3001;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
