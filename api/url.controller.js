/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /shorten/:url          ->  create/show
 */

'use strict';

var url = require('./url.model');
var mongoose = require('mongoose');



// Gets a single tag from the DB
exports.handleURL = function(req, res) {
    return url.findOne({ $or: [{ original_url: req.params[0] }, { short_url: req.params[0] }] }, function(error, data) {
        if (data.length !== 0) {
            var newTag = new Object();
            newTag.original_url = data.original_url;
            newTag.short_url = data.short_url;
            res.status(200).send(newTag);
        } else {
            var newTag = new Object();
            newTag.original_url = req.params[0];
            newTag.short_url = req.hostname + "/" + mongoose.Types.ObjectId();
            url.create(newTag, function(err, createdTag) {
                res.status(200).send(newTag);
            })
        }
    })
}