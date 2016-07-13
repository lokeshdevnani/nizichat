var express = require('express')
  , router = express.Router()
  ;

var returnRouter = function(io){

  router.use('/hash', require('./hash'));
  router.use('/users', require('./users'));

  router.get('/', function(req, res) {
    res.render('index');
  });

  router.get('/@:hash',function(req, res){
    var hash = req.params.hash;
    res.render('hash/hash',{hash: hash});
  });
  return router;
};

module.exports = returnRouter;
