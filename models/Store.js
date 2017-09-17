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
  tags : [String],
  created :   {
    type :Date,
    default : Date.now
  },
  location : {
    type:{
      type : String,
      default: 'Point'
    },
    coordinates: [{
        type : Number,
        required:'You must supply coordinates'
      }],
    address: {
      type : String,
      required:'You must supply an address'
    }
  },
  photo : String
});

storeSchema.pre('save', async function(next){
  if(!this.isModified('name')){
  	return next(); //skip and return
  }
   this.slug = slug(this.name);
   //find other stores that have a slug of wes, wes-1, wes-2
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)`,'i');
    const storeswithSlug = await this.constructor.find({slug : slugRegEx});

    if(storeswithSlug.length){
       this.slug  = `${this.slug} - ${storeswithSlug.length + 1}`;
    }
  
   next();
   //todo make more resiliant so slugs are unique
});

storeSchema.statics.getTagList = function(){
   return this.aggregate([
      {$unwind : '$tags'},
      {$group : {_id :'$tags', count: {$sum: 1}}},
    {$sort :{ count : -1}}
    ]); 
}



module.exports =  mongoose.model('Store', storeSchema);