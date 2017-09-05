const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
  name  :{
  	type : String,
  	trim : true,
  	required :  'Please enter a store name'
  },
  slug : String,
  description: String,
  tags : [String]
});

storeSchema.pre('save', function(next){
  if(!this.isModified('name')){
  	return next(); //skip and return
  }
   this.slug = slug(this.name);
   next();
   //todo make more resiliant so slugs are unique
});

module.exports =  mongoose.model('Store', storeSchema);