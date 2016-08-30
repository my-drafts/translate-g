var config = require('./cfg');
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
	out: { type: mongoose.Schema.Types.Mixed, default: null },
	outResponse: { type: mongoose.Schema.Types.Mixed, default: {} }
});
mongoose.connect(config);
var Translate = mongoose.model('translate', TranslateSchema);

module.exports.mongoose = mongoose;
module.exports.TranslateSchema = TranslateSchema;
module.exports.Translate = Translate;

module.exports.findOne = function(criteria){
	return new Promise(function(resolve, reject){
		Translate.findOne(criteria, function(error, record){
			error ? reject(error) : resolve(record);
		});
	});
};

module.exports.find = function(criteria){
	return new Promise(function(resolve, reject){
		try{
			resolve(Translate.find(criteria));
		}
		catch(error){
			reject(error);
		}
	});
};

module.exports.findById = function(id){
	try{
		id = mongoose.Types.ObjectId(id);
	}
	catch(error){
		id = '000000000000000000000000';
	}
	return new Promise(function(resolve, reject){
		Translate.findById(id, function(error, data){
			error ? reject(error) : resolve(data);
		});
	});
};

module.exports.save = function(document){
	return new Promise(function(resolve, reject){
		Translate(document).save(function(error, record){
			error ? reject(error) : resolve(record);
		});
	});
};
