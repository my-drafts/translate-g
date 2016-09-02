'use strict';


var config = require('./cfg');
var mongoose = require('mongoose');
var TranslateSchema = new mongoose.Schema({
	//_id: mongoose.Schema.Types.ObjectId,
	created: {type: Date, default: Date.now},
	modified: {type: Date, default: Date.now},
	sl: {type: String},
	tl: {type: String},
	proxy: {type: String, default: null},
	uri: {type: String},
	data: {type: mongoose.Schema.Types.Mixed, default: {}},
	addition: {type: mongoose.Schema.Types.Mixed, default: {}},
	out: {type: mongoose.Schema.Types.Mixed, default: null},
	outResponse: {type: mongoose.Schema.Types.Mixed, default: {}}
});
mongoose.connect(config);
var Translate = mongoose.model('translate', TranslateSchema);


module.exports.mongoose = mongoose;
module.exports.TranslateSchema = TranslateSchema;
module.exports.Translate = Translate;


module.exports.find = function(criteria, projection, options){
	// http://mongoosejs.com/docs/api.html#model_Model.find
	return new Promise(function(resolve, reject){
		Translate.find(criteria || null, projection || null, options || null, function(error, records){
			error ? reject(error) : resolve(records);
		});
	});
};

module.exports.findById = function(id, projection, options){
	// http://mongoosejs.com/docs/api.html#model_Model.findById
	return new Promise(function(resolve, reject){
		try{
			id = mongoose.Types.ObjectId(id);
		}
		catch(error){
			id = '000000000000000000000000';
		}
		Translate.findById(id, projection || null, options || null, function(error, data){
			error ? reject(error) : resolve(data);
		});
	});
};

module.exports.findByIdAndRemove = function(id, options){
	// http://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
	return new Promise(function(resolve, reject){
		try{
			id = mongoose.Types.ObjectId(id);
		}
		catch(error){
			id = '000000000000000000000000';
		}
		Translate.findByIdAndRemove(id, options || null, function(error, data){
			error ? reject(error) : resolve(data);
		});
	});
};

module.exports.findByIdAndUpdate = function(id, update, options){
	// http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
	return new Promise(function(resolve, reject){
		try{
			id = mongoose.Types.ObjectId(id);
		}
		catch(error){
			id = '000000000000000000000000';
		}
		Translate.findByIdAndUpdate(id, update || null, options || null, function(error, data){
			error ? reject(error) : resolve(data);
		});
	});
};

module.exports.findOne = function(criteria, projection, options){
	// http://mongoosejs.com/docs/api.html#model_Model.findOne
	return new Promise(function(resolve, reject){
		Translate.findOne(criteria || null, projection || null, options || null, function(error, record){
			error ? reject(error) : resolve(record);
		});
	});
};

module.exports.findOneAndRemove = function(criteria, options){
	// http://mongoosejs.com/docs/api.html#model_Model.findOneAndRemove
	return new Promise(function(resolve, reject){
		Translate.findOneAndRemove(criteria, options || null, function(error, record){
			error ? reject(error) : resolve(record);
		});
	});
};

module.exports.findOneAndUpdate = function(criteria, update, options){
	// http://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate
	return new Promise(function(resolve, reject){
		Translate.findOneAndUpdate(criteria || null, update || null, options || null, function(error, data){
			error ? reject(error) : resolve(data);
		});
	});
};

module.exports.save = function(options, safe, validateBeforeSave){
	// http://mongoosejs.com/docs/api.html#model_Model-save
	return new Promise(function(resolve, reject){
		Translate(options || null, safe || null, validateBeforeSave || null).save(function(error, record, numAffected){
			error ? reject(error) : resolve(record);
		});
	});
};

module.exports.remove = function(criteria){
	// http://mongoosejs.com/docs/api.html#model_Model-remove
	return new Promise(function(resolve, reject){
		Translate(criteria).remove(function(error, record){
			error ? reject(error) : resolve(record);
		});
	});
};
