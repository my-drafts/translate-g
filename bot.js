'use strict';


var tic = require('./lib/tic');


var tak = function(){
	const time = 1000*60*4;
	setTimeout(function(){
		tic().then(tak, tak);
	}, time);
};


tak();
