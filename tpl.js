var swig = require('swig');
var tpl = new swig.Swig({
	cache: false,
	locals:{},
	loader: swig.loaders.fs('./storage', {encoding: 'utf8'})
});

module.exports.swig = swig;
module.exports.tpl = tpl;
