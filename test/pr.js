'use strict';

var l = function(){
	console.log.apply(null, arguments);
	return arguments;
};

var pr = function(result){
	return new Promise(function(resolve, reject){
		result>0 ? resolve() : reject();
	});
};

pr(1)
	.then(function(r){
		l('r1');
		return pr(1);
	}).then(function(r){
		l('r2');
		return pr(1);
	}).then(function(r){
		l('r3');
		return pr(0);
	}).catch(function(r){
		l('e1');
		return pr(0);
	}).then(function(r){
		l('r4');
		return pr(1);
	}).catch(function(r){
		l('e2');
		return pr(1);
	}).then(function(r){
		l('r5');
		return pr(1);
	});