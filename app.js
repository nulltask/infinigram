/**
 * Module dependencies.
 */
require.paths.unshift('./node_modules');
var express = require('express');
var app = module.exports = express.createServer();
var clientId = process.env.INSTAGRAM_CLIENT_ID,
	clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
var Instagram = require('instagram-node-lib');
Instagram.set('client_id', clientId);
Instagram.set('client_secret', clientSecret);
var _ = require('underscore');
var delayTime = 0;

console.log(process.env);
console.log([clientId, clientSecret]);

// Configuration
app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	// use stylus
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

app.dynamicHelpers({
	title: function() {
		return 'infinigram';
	},
	p: function(req, res) {
		return req.params;
	},
	q: function(req, res) {
		return req.query;
	}
});

// Routes
app.get('/', function(req, res) {
	res.render('index');
});

app.get("/tags/:tag/media/recent.html", function(req, res) {
	var query = {};
	query.min_id = req.query.min_id;
	query.max_id = req.query.max_id;
	console.log(req.query);
	Instagram.tags.recent(_.extend({
		name: req.params.tag,
		complete: function(data, pagination) {
			// console.log([ pagination, data ]);
			console.log(pagination);
			setTimeout(function() {
				res.render("list", { data: data, pagination: pagination });
			}, delayTime);
		},
		error: function(errorMessage, errorObject, caller) {
			console.log([errorMessage, errorObject, caller]);
			res.send(500);
		}
	}, query));
});

// Only listen on $ node app.js
if (!module.parent) {
	app.listen(process.env.VMC_APP_PORT || 3000);
	console.log("Express server listening on port %d", app.address().port);
}
