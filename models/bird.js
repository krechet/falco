var mongoose = require('mongoose');

global.BirdSchema = new mongoose.Schema({
    name : {type:String, required : true, match : /^[\s\S]{0,50}$/},
    order : {type:String, required : true, match : /^[\s\S]{0,50}$/},
    family : {type:String, required : true, match : /^[\s\S]{0,50}$/},
    genus : {type:String, required : true, match : /^[\s\S]{0,50}$/},
    subgenus : {type:String, required : true, match : /^[\s\S]{0,50}$/}, 
    species : {type:String, required : true, match : /^[\s\S]{0,50}$/},
    image : String,
    description : String,
    img : { data: Buffer, contentType: String },
    ranges : {type:String}
});

mongoose.model('Bird', BirdSchema);



