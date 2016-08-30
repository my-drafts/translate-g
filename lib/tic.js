var pt = require('zanner-ptg');
var translating = pt.translate;
var db = require('./db');

var http = require('http');
var querystring = require('querystring');
var url = require('url');
var util = require('util'), uf = util.format;

var send = function(postData, uri, cb){
	return new Promise(function(resolve, reject){
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
				resolve({data: data, headers: response.headers, code: response.statusCode});
			});
		});
		request.on('error', function(error){
			reject(error);
		});
		request.write(postData);
		request.end();
	});
};

var timeTic = function(){
	return 1000*120;
};

var Tic = function(){
	db.findOne({out: null})
		.then(function(record){
			if(!record){
				setTimeout(Tic, timeTic());
				return;
			}

			// translate options
			var toptios = {
				fix: true,
				sl: record.sl,
				tl: record.sl,
				uri: uf('http://t.zanner.org.ua/task-to-translate/%s', record._id)
			};
			record.proxy ? Object.assign(toptios, {proxy: record.proxy}) : 0;

			// translating
			translating(toptios)
				.then(function(result){
					var out = {};
					result.$('html > body > div[id^="div-"]').each(function(index, element){
						var $ = result.$, key = $(element).attr('id').replace(/^div-/i, ''), value = $(element).html().trim();
						out[key] = value;
					});
					record.out = Object.assign(out);
					record.save(function(error, r){
						var data = Object.assign({}, {out: out}, record.addition);
						var uri = record.uri;
						send(data, uri)
							.then(function(r){
								record.outResponse = {code: r.code, headers: r.headers, data: r.data};
								record.save(function(error, r){
									setTimeout(Tic, timeTic());
								});
							})
							.catch(function(error){
								record.outResponse = {error: error};
								record.save(function(error, r){
									setTimeout(Tic, timeTic());
								});
							});
					});
				})
				.catch(function(error){
					record.out = {error: error};
					record.save(function(error){
						setTimeout(Tic, timeTic());
					});
				});
		})
		.catch(function(error){
			setTimeout(Tic, timeTic());
		});
};

module.exports.http = http;
module.exports.querystring = querystring;
module.exports.url = url;
module.exports.send = send;
module.exports.timeTic = timeTic;
module.exports.Tic = Tic;
