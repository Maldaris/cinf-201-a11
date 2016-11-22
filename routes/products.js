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
  var ProductModel = db.model('ProductModel');
  var ReviewModel = db.model('ReviewModel');
  var UserModel = db.model('UserModel');
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
    ProductModel.findOne({ productId : req.params.id  }, function(err, result){
      if(err) return fnError(res, err);
      if(result === null){ return  fnError(res,"No Such Product"); }
      return fnSuccess(res, result);
    });
  });

  router.get('/id/:id/score', function(req, res){
    return ReviewModel.count({
      product : req.param.id
    }, function(err, count){
      return ReviewModel.find({ product : req.param.id }, function(err, result){
        if(err) return fnError(res, err);
        console.log(result);
        var sum = 0;
        for(var i = 0 ; result.length; i++){
          sum += result[i].rating;
        }
        return fnSuccess(res, sum / count);
      });
    });
  });
  router.get('/all', function(req, res){
    return ProductModel.find({}, function(err, result){
      if(err) return fnError(res, err);
      else return fnSuccess(res, result);
    });
  });

  return router;
};
