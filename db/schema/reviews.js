var mongoose = require('mongoose');

var SchemaObject = {
  product : { type : mongoose.Schema.Types.ObjectId, ref : 'ProductModel'},
  rating : Number,
  author : String,
  body : String
};

var SchemaOptions = {
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  }
};


exports.init = function(db) {
  var Schema = new mongoose.Schema(SchemaObject, SchemaOptions);
  exports.user = db.model('ReviewModel', Schema);
  exports.exportedFields = ['review'];
};
