'use static';


var tic = require('./lib/tic');


var tics = function(){
	const time = 1000*120;
	let sto = function(){
		setTimeout(tics, time);
	};
	tic().then(sto, sto);
};

tics();
