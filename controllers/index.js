var express = require('express')
  , router = express.Router();

router.use('/hash', require('./hash'));
router.use('/users', require('./users'));

router.get('/', function(req, res) {
  res.render('index');
});

module.exports = router;
