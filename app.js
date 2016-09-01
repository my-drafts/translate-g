'use strict';


var encoding = require('encoding');
var mach = require('mach'), app = mach.stack();
var type = require('zanner-typeof'), of = type.of;
var db = require('./lib/db');
var tpl = require('./lib/tpl');


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


// uri: "/"
var tf1;
tpl.compileFile('index.html').then(function(tf){
	tf1 = tf;
});
app.get('/', function(conn){
	return tf1({});
});


// uri: "/tasks-ids-list"
var tf2;
tpl.compileFile('tasks-ids-list.html').then(function(tf){
	tf2 = tf;
});
app.get('/tasks-ids-list', function(conn){
	return db.find({}).then(function(cursor){
		cursor.sort({created:-1});
		let tasks = cursor.map(function(record){
			let json = JSON.stringify(record);
			let row = JSON.parse(json);
			return row;
		});
		return tf2({tasks: tasks});
	});
});

// uri: "/tasks-list"
var tf3;
tpl.compileFile('tasks-list.html').then(function(tf){
	tf3 = tf;
});
app.get('/tasks-list', function(conn){
	return db.find({}).then(function(cursor){
		cursor.sort({created:-1});
		let tasks = cursor.map(function(record){
			return JSON.stringify(record, null, '  ');
		});
		return tf3({tasks: tasks});
	});
});


// uri: "/task-to-translate/:id"
var tf4;
tpl.compileFile('task-to-translate.html').then(function(tf){
	tf4 = tf;
});
app.get('/task-to-translate/:id', function(conn){
	let render = function(translate){
		return tf4({lang: translate.sl || 'en', items: translate.data || false});
		//return tpl.renderFile('translate.html', {lang: translate.sl, items: translate.data});
	};
	return db.findById(conn.params.id || 0)
		.then(render)
		.catch(function(){
			return Promise.resolve(render({}));
		});
});

// uri: "/task/:id"
var tf5;
tpl.compileFile('task.html').then(function(tf){
	tf5 = tf;
});
app.get('/task/:id', function(conn){
	let render = function(translate){
		return tf5({task: translate ? JSON.stringify(translate, null, '  ') : '.'});
	};
	return db.findById(conn.params.id || 0)
		.then(render)
		.catch(function(){
			return Promise.resolve(render({}));
		});
});


// uri: "/task-send-form"
var tf6;
tpl.compileFile('task-send-form.html').then(function(tf){
	tf6 = tf;
});
app.get('/task-send-form', function(conn){
	return tf6({uri: 'http://zanner.org.ua/t/'});
});

app.post('/task-to-query', function(conn){
	return new Promise(function(resolve, reject){
		let rest = conn.params;

		// conn.params.data
		let data = rest.data;
		rest.data = undefined;
		delete rest.data;
		try{
			data = decodeURI(data);
			data = JSON.parse(data);
		}
		catch(error){
			data = undefined;
		}

		// conn.params.proxy
		let proxy = rest.proxy;
		rest.proxy = undefined;
		delete rest.proxy;
		if(!of(proxy, 'string')){
			proxy = undefined;
		}

		// conn.params.sl
		let sl = rest.sl;
		rest.sl = undefined;
		delete rest.sl;
		if(!of(sl, 'string')){
			sl = undefined;
		}

		// conn.params.tl
		let tl = rest.tl;
		rest.tl = undefined;
		delete rest.tl;
		if(!of(tl, 'string')){
			tl = undefined;
		}

		// conn.params.uri
		let uri = rest.uri;
		rest.uri = undefined;
		delete rest.uri;
		if(!of(uri, 'string')){
			uri = undefined;
		}

		if(data && sl && tl && uri){
			let t = {data: data, sl: sl, tl: tl, uri: uri};
			if(proxy) t.proxy = proxy;
			db.save(t).then(function(record){
				resolve(String(record._id));
			});
		}
		else resolve('.');
	});
});


app.get('/test', function(conn){
	return 'test-get. '+JSON.stringify(conn.params);
});

app.post('/test', function(conn){
	return 'test-post. '+JSON.stringify(conn.params);
});


app.get('/*', function(conn){
	return 'used unknown GET uri';
});

app.post('/*', function(conn){
	return 'use unknown POST uri';
});


mach.serve(app, {port: 8088});

