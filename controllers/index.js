var express = require('express');
var router = express.Router();

router.get('/about', function (req, res) {
    res.render('about', { user: req.session.user });
});

router.get('/contact', function (req, res) {
    res.render('contact', { user: req.session.user });
});

router.get('/*', function (req, res) {
    res.render('index', { user: req.session.user });
});

module.exports = router;