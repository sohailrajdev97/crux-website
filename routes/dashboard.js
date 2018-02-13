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
	membersModel.find({ github: req.user.username }, function (err, members) {
		if (err) {
			return console.log(err);
		}

		if (members.length == 0) {
			req.logout();
			res.render('messages', {
				title: "Unauthorized",
				message: "Only members can access the dashboard",
				callback: "/"
			});
		} else {
			membersModel.update({ github: req.user.username }, { picture: req.user._json.avatar_url }, function (err, result) {
				if (err) {
					return console.log(err);
				}
				res.redirect('/dashboard');
			});
		}
	});
});

router.get('/login', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/logout', function (req, res, next) {
	req.logout();
	res.redirect('/');
});

router.use(function (req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect('/dashboard/login');
	}
});

router.get('/', function (req, res, next) {
	res.json(req.user);
});

module.exports = router;
