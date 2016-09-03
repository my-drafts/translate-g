'use strict';


var db = require('./db');
var pt = require('zanner-ptg'), translate = pt.translate, send = pt.send;
var util = require('util'), uf = util.format;


var translateOptions = function(record, fix){
	let options = {
		fix: fix,
		sl: record.sl,
		tl: record.sl,
		uri: uf('http://t.zanner.org.ua/task-to-translate/%s', record._id)
	};
	if(record.proxy){
		options.proxy = record.proxy;
	}
	return options;
};
var out_divs = function($){
	let out = {};
	$('html > body > div[id^="div-"]').each(function(index, dic){
		let key = ($(div).attr('id') || '').replace(/^div-/i, '');
		let value = $(div).html().trim();
		if(key && value){
			out[key] = value;
		}
	});
	return out;
};
var out_send = function(record){
	let uri = record.uri;
	let data = {};
	Object.assign(data, {created: record.created});
	Object.assign(data, {data: record.data});
	Object.assign(data, {out: record.out});
	Object.assign(data, {proxy: record.proxy});
	Object.assign(data, {sl: record.sl});
	Object.assign(data, {tl: record.tl});
	Object.assign(data, {uri: record.uri});
	Object.assign(data, record.addition);
	return send(uri, data);
};
var tic = function(){
	let q = {
		out: null,
		outResponse: {
			'$ne': {}
		}
	};
	return db.findOne(q)
		.then(function(record){
console.log(1, record);
			if(!record){
				return Promise.resolve();
			}
			else{
				return translate(translateOptions(record, true))
					.then(function(result){
console.log(2, result);
						record.out = out_divs(result.$);
						return record.save();
					}, function(error){
console.log(3, error);
						record.out = {error: error};
						return record.save();
					})
					.then(function(){
						return out_send(record)
							.catch(function(error){
console.log(4, error);
								record.outResponse = {error: error};
								return record.save();
							});
					})
					.then(function(result){
console.log(5, result);
						record.outResponse = result;
						return record.save();
					});
			}
		});
};


module.exports = tic;

