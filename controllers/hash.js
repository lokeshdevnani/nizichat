var express = require('express')
  , router = express.Router()
  ;

router.get('/:id', function(req, res) {
  var id = req.params.id;
  res.render('hash/hash', {hash: id});
});

module.exports = router;
