var mach = require('mach');
//var mongoClient = require('mongodb').MongoClient;
var app = mach.stack();

//app.use(mach.basicAuth, function(user, pass){ return user=='admin' && pass=='1'; });
//app.use(mach.charset, 'utf-8');
//app.use(mach.contentType, 'text/html');
//app.use(mach.gzip);

app.use(mach.logger);
app.use(mach.modified);
app.use(mach.session, {
	expireAfter: 600,
	name: 'translate-session',
	secret: 'qwertyuiop[',
	secure: false
});

app.use(mach.favicon, {
	path: '/favicon.ico'
});

app.map('/current', function (app) {
	app.use(mach.file, {
		root: __dirname + '/storage/current',
		autoIndex: false,
		useLastModified: true,
		useETag: true
	});
});

app.map('/storage', function (app) {
	app.use(mach.file, {
		root: __dirname + '/storage',
		autoIndex: false,
		useLastModified: true,
		useETag: true
	});
});

app.get('/todo/add', function (conn) {
	return 'add+';
});

app.get('/todo/:id', function (conn) {
	var id = conn.params.id;

	conn.json(200, id);
});

app.get('/:lang/todo/:id', function (conn) {
	var id = conn.params.id + conn.params.lang;

	conn.json(200, id);
});

app.get('/data/:id', function (conn) {
	var id = conn.params.id;

	conn.json(200, id);
});

app.get('/', function () {
	return '<a href="/b">go to b</a>';
});

app.get('/b', function () {
	return '<a href="/c/' + Date.now() + '">go to c</a>';
});

app.get('/c/:id', function (conn) {
	return JSON.stringify({
		method: conn.method,
		location: conn.location,
		headers: conn.request.headers,
		params: conn.params
	}, null, 2);
});

mach.serve(app, {port: 3001});

