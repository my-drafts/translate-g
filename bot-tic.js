'use strict';


var tic = require('./lib/tic');


var run = function(){
	tic()
		.then(function(result){
			console.log('result: ', result);
		})
		.catch(function(error){
			console.log('error: ', error);
		});
}


setTimeout(run, 1000);

