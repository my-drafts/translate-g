var pt = require('zanner-ptg');
var fix = pt.fix, translating = pt.translate;
var Translate = require('./db').Translate;

var http = require('http');
var querystring = require('querystring');
var url = require('url');

var send = function(postData, uri, cb){
	postData = querystring.stringify(postData);
	var u = url.parse(uri);
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
		//console.log('STATUS: ' + response.statusCode);
		//console.log('HEADERS: ' + JSON.stringify(response.headers));
		response.setEncoding('utf8');
		var data = '';
		response.on('data', function(chunk){
			data += chunk;
			//console.log('BODY: ' + chunk);
		});
		response.on('end', function(){
			cb(null, data, response.headers, response.statusCode);
			//console.log('No more data in response.')
		});
	});
	request.on('error', function(error){
		cb(error);
		//console.log('problem with request: ' + error.message);
	});
	request.write(postData);
	request.end();
};

var timeTic = function(){
	return 1000*120;
};

var Tic = function(){
	var p = 'http://t.zanner.org.ua/d/';
	Translate.findOne({out: null}, function(error, r){
		if(error) setTimeout(Tic, timeTic());
		else if(r){
			translating(Object.assign({sl:r.sl, tl:r.tl, uri:p+r._id}, r.proxy?{proxy:r.proxy}:{}))
				.then(function(result){
					fix(result, true);
					var out = {};
					result.$('html > body > div[id^="div-"]').each(function(index, element){
						var $ = result.$, key = $(element).attr('id').replace(/^div-/i, ''), value = $(element).html().trim();
						out[key] = value;
					});
					r.out = Object.assign(out);
					r.save(function(error, r){
						send(Object.assign({}, {out:out}, r.addition), r.uri, function(error, resData, resHeaders, resCode){
							r.outResponse = error ? { error:error } : { code:resCode, headers:resHeaders, data:resData };
							r.save(function(error, r){
								setTimeout(Tic, timeTic());
							});
						});
					});
				}, function(error){
					r.out = { error:error };
					r.save(function(error){
						setTimeout(Tic, timeTic());
					});
				});
		}
		else setTimeout(Tic, timeTic());
	});
};

module.exports.http = http;
module.exports.querystring = querystring;
module.exports.url = url;
module.exports.send = send;
module.exports.timeTic = timeTic;
module.exports.Tic = Tic;
