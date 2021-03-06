'use strict';

var url = require('./url.model');
var mongoose = require('mongoose');
var validUrl = require('valid-url');

exports.redirect = function(req, res) {
    var checkShortURL = "https://" + req.hostname + "/" + req.params[0];

    url.findOne({ short_url: checkShortURL }, function(error, foundURL) {
        if (error) {
            return res.status(500).send(error);
        }
        if (foundURL) {
            return res.redirect(foundURL.original_url);
        } else {
            return res.status(404).send({ error: "Unkown URL" });
        }
    });
}

exports.handleURL = function(req, res) {

    if (validUrl.isUri(req.params[0])) {
        return getURL(req, res);
    } else {
        return res.status(500).send("Invalid URL")
    }

}

function getURL(req, res) {
    url.findOne({ $or: [{ original_url: req.params[0] }, { short_url: req.params[0] }] },
        function(error, data) {
            if (error) {
                return res.status(500).send(error);
            }
            if (data) {
                var newTag = new Object();
                newTag.original_url = data.original_url;
                newTag.short_url = data.short_url;
                return res.status(200).send(newTag);
            } else {
                var newTag = new Object();
                newTag.original_url = req.params[0] + appendQuery(req.query);
                url.count({}, function(error, count) {
                    if (error) return res.send({ error: "Something went wrong" });
                    return saveURL(req, res, count, newTag)
                });
            }
        });
}

function saveURL(req, res, count, newTag) {
    newTag.short_url = "https://" + req.hostname + "/" + count;
    url.create(newTag, function(err, createdTag) {
        return res.status(200).send(newTag);
    });
}

function appendQuery(query) {
    var result = "?";
    for (var prop in query) {
        result += prop + "=" + query[prop] + "&";
    }
    return result.substring(0, result.length - 1);
}