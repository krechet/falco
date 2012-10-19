require('../models/bird');
var fs = require('fs'),
idgen = require('idgen'),
gm = require('gm');


exports.add = function(req, res){

    var Bird = db.model('Bird');
    
    var bird = new Bird(req.body);
    
    

    bird.save(function(err,item){
        if(err){
            res.send({
                err:err
            });
        }else {
            res.redirect('/birds/'+item._id.toHexString());
        }
    });

}

exports.get = function(req, res){
    
    var bird = db.model('Bird',BirdSchema);
    
    bird.findById(req.params.id, function(err, item){
        if(err){ 
            res.send({
                err:err
            });
            return;
        }
        if(item)
            res.send(item);
        else
            res.send({
                'err' : 'not found'
            });
    } );
    
}

exports.getAll = function(req, res){
    
    var bird = db.model('Bird',BirdSchema);
    
    bird.find({}, function(err, items){
        if(err){
            res.send({
                err:err
            });
            return;
        }

        if(items)
            res.send(items);
        else
            res.send({
                'err' : 'not found'
            });
    } );
    
}

exports.newForm = function(req, res){

    res.render('newBirdForm',{});
    
}

exports.del = function(req, res){
    console.log('deleting');
    
}



exports.edit = function(req, res){
    var bird = db.model('Bird',BirdSchema);
    
    // test id : 506be0ef06450f410d000001
    bird.findByIdAndUpdate(req.params.id, req.body, {}, function(err, item){
        
        if(err){
            res.send({
                err:err
            });
        }
        
        if(item){
            item.validate(function(err){
                if(err){
                    res.send({
                        err:err
                    });
                }else{
                    var fName = idgen(20);
                        
                    var pattern = new RegExp(/^.*\/(.*)$/);
                    var match = req.files.img.type.match(pattern);
                    var ext = match[1];
                        
                    fName += '.'+ext;
                    
                    gm(req.files.img.path)
                    .resize(128, 128)
                    .noProfile()
                    .write( __dirname+'/../public/images/birds/th_'+fName, function (err) {
                        if(err)
                            throw err;
                        fs.rename(req.files.img.path, __dirname+'/../public/images/birds/'+fName);

                    });
    
                        
                    item.image = fName;
                        
                    item.save(function(){
                        res.redirect('/birds/'+item._id.toHexString());
                    });
                }
            });
        }
        else
            res.send({
                'err' : 'not found'
            });
    } );
}

exports.editForm = function(req, res){
    
    var bird = db.model('Bird',BirdSchema);
    
    bird.findById(req.params.id, function(err, item){
        
        if(err){
            throw(err);
        }
        if(item){
            console.log(item);
            res.render('editBirdForm', {
                locals : item
            });
        }
        else
            res.send({
                'err' : 'not found'
            });
    } );
    
    
}
