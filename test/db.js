var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TranslateSchema = new Schema({
	created: { type: Date, default: Date.now },
	modified: { type: Date, default: Date.now },
	sl: { type: String },
	tl: { type: String },
	uri: { type: String },
	data: { type: mongoose.Schema.Types.Mixed, default: {} },
	addition: { type: mongoose.Schema.Types.Mixed, default: {} },
	out: { type: mongoose.Schema.Types.Mixed, default: null }
});
mongoose.connect('mongodb://localhost/translate');
var Translate  = mongoose.model('translate', TranslateSchema);

var t1 = new Translate({ sl:'ru', tl:'uk', uri:'http://1', data: {title: 'Привет', description: 'медаль'} });
t1.save(function(error){
	if(error) console.log('error', error);
	else{
		console.log(arguments);
		console.log(t1);
		return;
		Translate.update({_id: '56cfab5a71d0c41d87b63133'}, { $set: {out: {a:'Привет'}} }, {}, function (err, affected) {
			if (err) console.log('error', err);
			else{
				console.log('ok');
				//Translate.find({}, {}, {}, function(error, rows){
					mongoose.disconnect();
				//});
			}
		});
	}
});
