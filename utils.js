var config = require('./config.js');
var request = require('request');

function get_short_url(longUrl, func) {

    var login = config.login;
    var api_key = config.apiKey;
    var url = "http://api.bitly.com/v3/shorten?format=json&apiKey=" + api_key +
        "&login=" + login +
        "&longUrl=" + longUrl;
    request.get(
        url,
        function(err, response, body) {
            if (!response)
                console.log('Error happened');
            else {
                func(JSON.parse(body).data.url);
            }

        });
}
module.exports = {
    shorten_url: get_short_url
}