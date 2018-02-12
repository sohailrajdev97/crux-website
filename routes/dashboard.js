var express = require('express');
var router = express.Router();
var session = require("express-session");

var fq = require('fuzzquire');
var config = fq('config');
var membersModel = fq('schemas/members');

var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

passport.serializeUser(function (user, done) {
	done(null, user.username);
});

passport.deserializeUser(function (username, done) {
	membersModel.findOne({ github: username }, function (err, member) {
		return done(err, member);
	});
});

passport.use(new GitHubStrategy({
		clientID: config.clientID,
		clientSecret: config.clientSecret,
		callbackURL: config.siteRoot + '/dashboard/login/callback'
	},
	function (accessToken, refreshToken, profile, done) {
		return done(null, profile);
	}
));

router.use(express.static("public"));
router.use(session({ secret: "CRUX-BPHC-LOGIN" }));
router.use(passport.initialize());
router.use(passport.session());

router.get('/login/callback', passport.authenticate('github', { failureRedirect: '/login' }), function (req, res, next) {
	res.redirect('/dashboard');
});

router.get('/login', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/', function(req, res, next){
	res.json(req.user);
});

module.exports = router;
