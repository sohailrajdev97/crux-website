var express = require('express');
var router = express.Router();

var finalString;

router.post('/generate', function (req, res, next) {

	finalString = '';

	finalString += 'module.exports = {\n\n';

	finalString += '\tsiteRoot: "' + req.body.siteRoot + '",\n';
	finalString += '\tmongooseConnection: "' + req.body.connectionString + '",\n';

	finalString += '\tclientID: "' + req.body.client + '",\n';
	finalString += '\tclientSecret: "' + req.body.secret + '",\n';

	finalString += '\n};';

	res.setHeader('content-type', 'text/javascript');
	res.send(finalString);

});

router.get('/', function (req, res, next) {
	res.render('config-generator');
});

module.exports = router;
