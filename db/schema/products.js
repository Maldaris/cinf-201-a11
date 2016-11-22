var mongoose = require('mongoose');

var SchemaObject = {
  name : String,
  price : String,
  creator : String
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
  exports.user = db.model('ProductModel', Schema);
  exports.exportedFields = ['product'];
};
