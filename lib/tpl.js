var swig = require('swig');
var tpl = new swig.Swig({
	cache: false,
	locals:{},
	loader: swig.loaders.fs('./storage', {encoding: 'utf8'})
});

module.exports.swig = swig;
module.exports.tpl = tpl;
module.exports.renderFile = function(filePath, templateData){
	return new Promise(function(resolve, reject){
		tpl.renderFile(filePath, templateData, function(error, out){
			error ? reject(error) : resolve(out);
		});
	});
};

module.exports.compileFile = function(filePath, options){
	return new Promise(function(resolve, reject){
		tpl.compileFile(filePath, options, function(error, compiled){
			error ? reject(error) : resolve(compiled);
		});
	});
};

module.exports.compile = function(htmlText, options){
	return new Promise(function(resolve, reject){
		var compiled = tpl.compile(htmlText, options);
		resolve(compiled);
	});
};

