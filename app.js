var pt = require('zanner-ptg');
var fix = pt.fix, translate = pt.translate;

var swig = require('swig');
var tpl = new swig.Swig({
	cache: false,
	locals:{},
	loader: swig.loaders.fs('./storage', {encoding: 'utf8'})
});

var encoding = require('encoding');
var mach = require('mach');
var app = mach.stack();
app.use(mach.logger);
app.use(mach.modified);
app.use(mach.params);

app.use(mach.file, {
	root: __dirname + '/storage/',
	autoIndex: false,
	useLastModified: true,
	useETag: true
});

app.get('/', function(conn){
	return new Promise(function(resolve, reject){
		tpl.renderFile('frontpage.html', {}, function(error, out){
			if(error) reject(error)
			else resolve(out);
		});
	});
});

app.post('/translate', function(conn){
	var q = conn.params, uri = q.uri, sl = q.sl, tl = q.tl;
	return new Promise(function(resolve, reject){
		translate(sl, tl, uri)
			.then(function(result){
				fix(result, true);
				var html = result.$('html body').html();
				//console.log(encoding.convert(html, 'cp1251', 'UTF-8').toString());
				tpl.renderFile('translate.html', {body: html}, function(error, out){
					if(error) reject(error)
					else resolve(out);
				});
			}, function(error){
				conn.html('.');
			});
	});
});

mach.serve(app, {port: 3001});
