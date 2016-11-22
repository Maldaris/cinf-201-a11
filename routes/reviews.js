var Router = require('express').Router;
var crypto = require('crypto');
var sanitize = require('mongo-sanitize');

var fnError = function(res, err) {
    return res.end(JSON.stringify({
        'success': false,
        'error': err.toString()
    }));
}
var fnSuccess = function(res, err) {
    return res.end(JSON.stringify({
        'success': true,
        'result': err
    }));
}
exports.init = function(db){
  var ReviewModel = db.model('ReviewModel');
  var router = new Router();

  router.use(function(req, res, next){
    if(req.session.isAuthenticated !== true){
      return fnError(res, "Not Logged In.");
    } else {
      return next();
    }
  });
  router.use(function(req, res, next){
    if(req.body !== null || req.body !== undefined)
      req.body = sanitize(req.body);
    return next();
  });
  router.get('/id/:id', function(req, res){
    ReviewModel.findOne({ _id : req.params.id }, function(err, result){
      if(err) return fnError(res, err);
      if(result === null){ return  fnError(res,"No Such Product"); }
      return fnSuccess(res, result);
    });
  });

  router.get('/product/:id', function(req, res){
    ReviewModel.find({product  : req.params.id }, function(err, result){
      if(err) return fnError(res, err);
      return fnSuccess(res, result);
    });
  });

  router.post('/new', function(req, res){
    var body = req.body;
    var toAdd = new ReviewModel(body);
    return toAdd.save(function(err){
      if(err) return fnError(res, err);
      else return fnSuccess(res, true);
    });
  });
  router.get('/all', function(req, res){
    return ReviewModel.find({}, function(err, result){
      if(err) return fnError(res, err);
      return fnSuccess(res, result);
    });
  });

  return router;
};
