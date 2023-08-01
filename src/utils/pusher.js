var http = require('http');
var querystring = require('querystring');

async function postPushReq(post_data, next) {
    try{
    // Build the post string from an object
    
        // An object of options to indicate where to post to
        var post_options = {
            host: process.env.PUSH_HOST,
            port: process.env.PUSH_PORT,
            path: '/api/push',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(post_data)
            }
        };
    
        // Set up the request
        var post_req = http.request(post_options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('Response: ' + chunk);
            });
        });
    console.log(post_data)
        // post the data
        post_req.write(post_data);
        post_req.end();
    }
    catch(err){
        next(err)
    }
  
}

module.exports = {
    postPushReq
}