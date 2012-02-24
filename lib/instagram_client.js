
/**
 * Module dependencies.
 */

var Instagram = require('instagram-node-lib')
   , clientId = process.env.INSTAGRAM_CLIENT_ID
   , clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;

/**
 * Set API keys.
 */

Instagram.set('client_id', clientId);
Instagram.set('client_secret', clientSecret);

/**
 * Expose InstagramClient
 */

module.exports = Instagram;