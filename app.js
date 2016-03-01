var of = require('zanner-typeof').of;
var pt = require('zanner-ptg');
var fix = pt.fix, translating = pt.translate;

var mongoose = require('mongoose');
var TranslateSchema = new mongoose.Schema({
	//_id: mongoose.Schema.Types.ObjectId,
	created: { type: Date, default: Date.now },
	modified: { type: Date, default: Date.now },
	sl: { type: String },
	tl: { type: String },
	proxy: { type: String, default: null },
	uri: { type: String },
	data: { type: mongoose.Schema.Types.Mixed, default: {} },
	addition: { type: mongoose.Schema.Types.Mixed, default: {} },
	out: { type: mongoose.Schema.Types.Mixed, default: null }
});
mongoose.connect('mongodb://localhost/translate');
var Translate  = mongoose.model('translate', TranslateSchema);

var swig = require('swig');
var tpl = new swig.Swig({
	cache: false,
	locals:{},
	loader: swig.loaders.fs('./storage', {encoding: 'utf8'})
});

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

var encoding = require('encoding');
var mach = require('mach');
var app = mach.stack();
app.use(mach.logger);
app.use(mach.modified);
app.use(mach.params);

app.get('/storage/*', function(conn){
	return mach.file({
		root: __dirname,
		autoIndex: false,
		useLastModified: true,
		useETag: true
	})(conn);
});

/** /
app.use(mach.file, {
	root: __dirname + '/storage/',
	autoIndex: false,
	useLastModified: true,
	useETag: true
});
/**/

app.get('/', function(conn){
	return new Promise(function(resolve, reject){
		tpl.renderFile('index.html', {}, function(error, out){
			if(error) reject(error)
			else resolve(out);
		});
	});
});

app.get('/d/:id', function(conn){
	return new Promise(function(resolve, reject){
		var id = conn.params.id || 0;
		Translate.findById(id, function(error, translate){
			tpl.renderFile('translate.html', {
				items: error ? false : translate.data
			}, function(error, out){
				if(error) reject(error)
				else resolve(out);
			});
		});
	});
});

app.get('/f', function(conn){
	return new Promise(function(resolve, reject){
		tpl.renderFile('form.html', {
			bot: true
		}, function(error, out){
			if(error) reject(error)
			else resolve(out);
		});
	});
});

app.get('/test', function(conn){
	return 'test ' + JSON.stringify(conn.params);
});

app.post('/test', function(conn){
	return 'test ' + JSON.stringify(conn.params);
});

app.post('/q', function(conn){
	return new Promise(function(resolve, reject){
		const KEYS = ['data', 'proxy', 'sl', 'tl', 'uri'];
		var t = { addition: Object.assign({}, conn.params) };
		for(var i=0; i<KEYS.length; i++){
			var k = KEYS[i];
			if(!(k in t.addition)) continue;
			else if(k==='data'){
				try{
					if(of(t.addition[k], 'string')) t[k] = JSON.parse(decodeURI(t.addition[k]));
				}
				catch(error){}
				if(of(t.addition[k], 'object')){
					t[k] = Object.assign({}, t.addition[k]);
					Object.keys(t[k]).forEach(function(v){
						if(!of(t[k][v], 'string')) delete t[k][v];
					});
				}
			}
			else{
				if(of(t.addition[k], 'string')) t[k] = t.addition[k];
			}
			delete t.addition[k];
		}
		if(t.data && t.sl && t.tl && t.uri){
			var t1 = new Translate(t);
			t1.save(function(error, record){
				resolve(String(record._id));
			});
		}
		else resolve('.');
	});
});
/*
app.get('/t/:id', function(conn){
	return new Promise(function(resolve, reject){
		var id = conn.params.id || 0;
		Translate.findById(id, function(error, translate){
			if(error) resolve('.');
			else{
				var result = {
					data: translate.data,
					query: translate.query,
					result: Object.assign({}, translate.query, translate.addition)
				};
				resolve(JSON.stringify(result));
			}
		});
	});
});

app.post('/upload', function(conn){
	var q = conn.params, uri = q.uri, sl = q.sl, tl = q.tl;
	return new Promise(function(resolve, reject){
		console.log(q);
		translating(sl, tl, uri)
			.then(function(result){
				fix(result, true);
				var html = result.$('html body').html();
				//console.log(encoding.convert(html, 'cp1251', 'UTF-8').toString());
				tpl.renderFile('upload.html', {body: html}, function(error, out){
					if(error) reject(error)
					else resolve(out);
				});
			}, function(error){
				conn.html('.');
			});
	});
});
*/
mach.serve(app, {port: 8088});

var timeTic = function(){
	return 1000*15;
};
var Tic = function(){
	var p = 'http://t.zanner.org.ua/d/';
	Translate.findOne({out: null}, function(error, r){
		translating(Object.assign({sl:r.sl, tl:r.tl, uri:p+r._id}, r.proxy?{proxy:r.proxy}:{}))
			.then(function(result){
				fix(result, true);
				var out = {};
				result.$('html > body > div[id^="div-"]').each(function(index, element){
					var $ = result.$, key = $(element).attr('id').replace(/^div-/i, ''), value = $(element).html();
					out[key] = value;
				});
				r.out = Object.assign(out);
				r.save(function(error){
					send(Object.assign({}, {out:out}, r.addition), r.uri, function(error, resData, resHeaders, resCode){
						setTimeout(Tic, timeTic());
					});
				});
			}, function(error){
				setTimeout(Tic, timeTic());
			});
	});
};
Tic();