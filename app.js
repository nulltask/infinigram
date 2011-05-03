/**
 * Module dependencies.
 */
require.paths.unshift('./node_modules');
var express = require('express');
var app = module.exports = express.createServer();
var clientId = process.env.INSTAGRAM_CLIENT_ID;
var clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
var instagram = require('instagram').createClient(clientId, clientSecret);

console.log(process.env);
console.log([clientId, clientSecret]);

// Configuration
app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(require('stylus').middleware({ src: __dirname + '/public' }));
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});
app.configure('development', function() {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});
app.configure('production', function() {
	app.use(express.errorHandler()); 
});

// Routes
app.get('/', function(req, res) {
	res.render('index', {
		title: 'infinigram'
	});
});

app.get("/tags/:tag.json", function(req, res) {
	console.log(req.query);
	instagram.tags.media(req.params.tag, req.query, function(tags, err) {
		if (err) {
			res.render('error');
		}
		else {
			res.send(tags);
		}
	});
});

// Only listen on $ node app.js
if (!module.parent) {
	app.listen(process.env.VMC_APP_PORT || 3000);
	console.log("Express server listening on port %d", app.address().port);
}
