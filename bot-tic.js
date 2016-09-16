'use strict';


var tic = require('./lib/tic');


tic()
	.then(function(result){
		console.log('result: ', result);
	})
	.catch(function(error){
		console.log('error: ', error);
	});
