var express = require('express')
  , router = express.Router()
  ;

router.get('/:id', function(req, res) {
  var id = req.params.id;
  
  Comment.get(req.params.id, function (err, comment) {
    res.render('comments/comment', {comment: comment});
  });
});

module.exports = router;
