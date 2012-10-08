var mongoose = require('mongoose');

global.BirdSchema = new mongoose.Schema({
    name : {type:String, required : true, match : /^[\s\S]{0,50}$/},
    order : {type:String, required : true, match : /^[\s\S]{0,50}$/},
    family : {type:String, required : true, match : /^[\s\S]{0,50}$/},
    genus : {type:String, required : true, match : /^[\s\S]{0,50}$/},
    subgenus : {type:String, required : true, match : /^[\s\S]{0,50}$/}, 
    species : {type:String, required : true, match : /^[\s\S]{0,50}$/}  
});

mongoose.model('Bird', BirdSchema);



