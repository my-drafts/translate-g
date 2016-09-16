'use strict';


var db = require('./db');
var pt = require('zanner-ptg'), translate = pt.translate, send = pt.send;
var util = require('util'), uf = util.format;


var translateOptions = function(record, fix){
	let proxy = record.proxy;
	let uri = uf('http://t.zanner.org.ua/task-to-translate/%s', record._id);
	let options = Object.assign({fix: fix, sl: record.sl, tl: record.tl, uri: uri}, proxy ? {proxy: proxy} : {});
	return options;
};
var out_divs = function($){
	let out = {};
	$('html > body > div[id^="div-"]').each(function(index, div){
		let key = ($(div).attr('id') || '').replace(/^div-/i, '').trim();
		let value = $(div).html().trim();
		if(!key && !value) return;
		out[key] = value;
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
		//'$where': function(){ return this.data && Object.keys(this.data) && !this.error && !this.out && !this.outResponse; }
		//data: {'$type': 3},
		//error: null,
		out: null,
		outResponse: null
	};
	console.log(q);
	return Promise.resolve(q)
		.then(function(result){
			return db.findOne(result);
		})
		.then(function(record){
			console.log('[1] record: ', !!record);
			return record ? Promise.resolve(record) : Promise.reject(false);
		});/*
		.then(function(record){
			return translate(translateOptions(record, true))
				.catch(function(error){
					console.log('[3] transleted-er:', error);
					let update = [{_id: record._id}, {'$set': {error: {out: error}, modified: new Data()}}, {multi: false}];
					return Promise.reject(update);
				})
				.then(function(result){
					console.log('[3] transleted-ok:', result.$(':root').html());
					let update = [{_id: record._id}, {'$set': {out: out_divs(result.$), modified: new Data()}}, {multi: false}];
					return Promise.resolve(update);
				})
				.then(function(update){
					return db.update.apply(db, update)
						.catch(function(error){
							return Promise.reject(false);
						});
				})
				.then(function(raw){
					return out_send(record)
						.catch(function(error){
							console.log('[4] send-er:', error);
							let update = [{_id: record._id}, {'$set': {error: {outResponse: error}, modified: new Data()}}, {multi: false}];
							return Promise.reject(update);
						})
						.then(function(result){
							console.log('[4] send-ok:', result);
							let update = [{_id: record._id}, {'$set': {outResponse: result, modified: new Data()}}, {multi: false}];
							return Promise.resolve(update);
						})
						.then(function(update){
							return db.update.apply(db, update)
								.catch(function(error){
									return Promise.reject(false);
								});
						});
				});
		})
		.catch(function(update){
			let rj = function(raw){
				return Promise.reject();
			};
			return update ? db.update.apply(db, update).then(rj) : rj();
		});*/
};


module.exports = tic;

