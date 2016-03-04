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
mongoose.connect(require('./db-cfg'));
var Translate  = mongoose.model('translate', TranslateSchema);

module.exports.mongoose = mongoose;
module.exports.TranslateSchema = TranslateSchema;
module.exports.Translate = Translate;
