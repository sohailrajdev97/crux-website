var express = require('express');
var router = express.Router();
var session = require("express-session");

var fq = require('fuzzquire');
var config = fq('config');

var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	done(null, id);
});

passport.use(new GitHubStrategy({
		clientID: config.clientID,
		clientSecret: config.clientSecret,
		callbackURL: config.siteRoot + '/login/callback'
	},
	function (accessToken, refreshToken, profile, done) {
		return done(null, profile);
	}
));

router.use(express.static("public"));
router.use(session({ secret: "CRUX-BPHC-LOGIN" }));
router.use(passport.initialize());
router.use(passport.session());

router.get('/callback', passport.authenticate('github', { failureRedirect: '/login' }), function (req, res, next) {
	res.redirect('/');
});

router.get('/', passport.authenticate('github', { scope: ['user:email'] }));

module.exports = router;
