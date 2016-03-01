var http = require('http');
var querystring = require('querystring');
var url = require('url');

var postData = querystring.stringify({
	'msg' : 'Hello World!'
});

var u = url.parse('http://localhost:8088/test');
console.log(u);

var options = {
	hostname: u.hostname,
	port: u.port,
	path: u.path,
	method: 'POST',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': postData.length
	}
};

var request = http.request(options, function(response){
	console.log('STATUS: ' + response.statusCode);
	console.log('HEADERS: ' + JSON.stringify(response.headers));
	response.setEncoding('utf8');
	response.on('data', function(chunk){
		console.log('BODY: ' + chunk);
	});
	response.on('end', function(){
		console.log('No more data in response.')
	});
});

request.on('error', function(error){
	console.log('problem with request: ' + error.message);
});

request.write(postData);
request.end();