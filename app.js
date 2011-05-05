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

app.dynamicHelpers({
	title: function() {
		return 'infinigram';
	},
	params: function(req, res) {
		return req.params;
	},
	query: function(req, res) {
		return req.query;
	}
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
			res.send(404);
		}
		else {
			res.send(tags);
		}
	});
});
app.get("/tags/:tag.html", function(req, res) {
	console.log(req.query);
	var query = {};
	if (req.query.max_id) query.max_id = req.query.max_id;
	if (req.query.min_id) query.min_id = req.query.min_id;
	console.log(query);
	instagram.tags.media(req.params.tag, query, function(tags, err) {
		console.log(err);
		console.log(tags);
		if (err) {
			res.send(404);
		}
		else {
			tags.reverse();
			var lastItem = tags.pop();
			tags.push(lastItem);
			res.render("list", { data: tags, lastItem: lastItem });
		}
	});
});

// Only listen on $ node app.js
if (!module.parent) {
	app.listen(process.env.VMC_APP_PORT || 3000);
	console.log("Express server listening on port %d", app.address().port);
}
