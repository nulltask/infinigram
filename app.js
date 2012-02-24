
/**
 * Module dependencies.
 */

var express = require('express')
  , app = module.exports = express.createServer()
  , Instagram = require('./lib/instagram_client')
  , _ = require('underscore');

/**
 * Configuration.
 */

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src : __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.logger('dev'));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

/**
 * Helpers.
 */

app.helpers({
  title: 'infinigram'
})

app.dynamicHelpers({
  p: function(req, res) {
    return req.params;
  }
, q: function(req, res) {
    return req.query;
  }
, e: function(req, res) {
    return process.env;
  }
});

/**
 * Routes
 */

app.get('/', function(req, res) {
  res.render('index');
});

app.get("/tags/:tag/media/recent.html", function(req, res) {
  
  var query = {
    min_id: req.query.min_id
  , max_id: req.query.max_id
  };
  
  Instagram.tags.recent(_.extend({
    name: req.params.tag
  , complete: function(data, pagination) {
      res.render("list", {
        data: data
      , pagination: pagination
      });
    },
    error : function(errorMessage, errorObject, caller) {
      res.send(500);
    }
  }, query));
});

app.listen(process.env.PORT || process.env.VMC_APP_PORT || 3000);
console.log("Express server listening on port %d", app.address().port);
