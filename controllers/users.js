var express = require('express');
var controller = express.Router();

/* GET users listing. */
controller.get('/', function(req, res, next) {
  res.send('Felipe');
});

module.exports = controller;
