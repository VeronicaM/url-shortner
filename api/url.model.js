'use strict';

var mongoose = require('mongoose');

var UrlSchema = new mongoose.Schema({
    original_url: String,
    short_url: String
});

module.exports = mongoose.model('URL', UrlSchema);