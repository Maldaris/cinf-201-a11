var Router = require('express').Router;
var crypto = require('crypto');
var sanitize = require('mongo-sanitize');

var validate = {
    '/register': {
        fields: ['user', 'pass'],
        strict: true
    },
    '/login': {
        fields: ['user', 'pass'],
        strict: true
    },
    '/logout': {
        fields: [],
        strict: false
    }
}
var res_error = function(res, err) {
    return res.end(JSON.stringify({
        'success': false,
        'error': err.toString()
    }));
}
var res_success = function(res, err) {
    return res.end(JSON.stringify({
        'success': true,
        'result': err
    }));
}
var hash = function(password, username) {
    var hash = crypto.createHash('md5');
    hash.update(password + username);
    return hash.digest('base64');
};

var init = function(db) {
    var UserModel = db.model('UserModel');
    var router = new Router();
    router.post('/register', function(req, res) {
        var body = req.body;
        if (body === false)
            res_error(res, 'Invalid post body.');
        var clean = sanitize(body);
        return UserModel.findOne({
            'username': clean.username
        }, function(err, result) {
            if (err) return res_error(res, err);
            console.log(result);
            if (result !== null)
                return res_error(res, 'User already exists');
            else
                return (new UserModel({
                    'username': clean.username,
                    'password': hash(clean.password, clean.username)
                })).save(function(err) {
                    if (err) return res_error(res, err);
                    return res_success(res, 'Registered Successfully!');
                });
        });
    });
    router.post('/login', function(req, res) {
        var body = req.body;
        if (body === false)
            res_error(res, 'Invalid post body.');
        var clean = sanitize(body);
        return UserModel.findOne({
            'username': clean.username,
            'password': hash(clean.password, clean.username)
        }, function(err, result) {
            if (err) return res_error(res, err);
            if (result === null) return res_error(res, 'No Such User');
            req.session.isAuthenticated = true;
            req.session.username = res.username;
            return res_success(res, 'Logged In Successfully!');
        });
    });
    router.post('/logout', function(req, res) {
        req.session.isAuthenticated = false;
        req.session.userData = null;
        return res_success(res, 'Logged out.');
    });
    return router;
};

exports.init = init;
