var of = require('zanner-typeof').of;
var pt = require('zanner-ptg');
var fix = pt.fix, translating = pt.translate;

var Translate = require('./db').Translate;
var tpl = require('./tpl').tpl;
var Tic = require('./tic').Tic;

var encoding = require('encoding');
var mach = require('mach');
var app = mach.stack();
//app.use(mach.logger);
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
				lang: !error && translate && translate.sl ? translate.sl : 'en',
				items: !error && translate && translate.data ? translate.data : false
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

app.get('/t/:id', function(conn){
	return new Promise(function(resolve, reject){
		var id = conn.params.id || 0;
		Translate.findById(id, function(error, translate){
			resolve(JSON.stringify(error ? {error:error} : translate));
		});
	});
});

app.get('/*', function(conn){
	return 'unknown';
});

app.post('/*', function(conn){
	return 'unknown';
});

mach.serve(app, {port: 8088});

Tic();