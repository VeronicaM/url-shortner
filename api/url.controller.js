'use strict';

var url = require('./url.model');
var mongoose = require('mongoose');

exports.redirect = function(req, res){
    var checkShortURL = "https://"+req.hostname + "/" + req.params[0];
 
   url.findOne({short_url: checkShortURL}, function(error, foundURL){
      if(error) {
        return res.status(500).send(error);
      }  
      if(foundURL){
        return  res.redirect(foundURL.original_url);
      }
   });
}

exports.handleURL = function(req, res) {
    url.findOne({ $or: [{ original_url: req.params[0] }, { short_url: req.params[0] }] }, function(error, data) {
        if(error) {
          return res.status(500).send(error);
        }
        if (data) {
            var newTag = new Object();
            newTag.original_url = data.original_url;
            newTag.short_url = data.short_url;
            return res.status(200).send(newTag);
        } else {
            var newTag = new Object();
            newTag.original_url = req.params[0];
            newTag.short_url = "https://"+req.hostname + "/" + mongoose.Types.ObjectId();
            url.create(newTag, function(err, createdTag) {
               return  res.status(200).send(newTag);
            });
        }
    }); 
}