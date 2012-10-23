require('../models/bird');
var fs = require('fs'),
idgen = require('idgen'),
gm = require('gm'),
im = require('imagemagick');

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

isValidImageExt = function(ext)
{
   return ['jpg','jpeg', 'gif', 'png'].contains(ext); 
}


exports.add = function(req, res){

    var Bird = db.model('Bird');
    
    var bird = new Bird(req.body);
    
    var fName = idgen(20);
                        
    var pattern = new RegExp(/^.*\/(.*)$/);
    var match = req.files.img.type.match(pattern);
    var ext = match[1];
                        
    fName += '.'+ext;
    
    if(!isValidImageExt(ext))
        fName = '';                    
    
    placeImage(req.files.img.path, fName, req.body.gravity, fName);
                    
    bird.image = fName;    

    bird.save(function(err,item){
        if(err){
            res.send({
                err:err
            });
        }else {
            res.redirect('/');
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
    
    var bird = db.model('Bird',BirdSchema);
    
    bird.findById(
        req.params.id
        ,function(err,item){
    
            if(err){
                res.send({
                    err:err
                });
                return;
            }
    
            if(item){
                if(item.image){
                    fs.unlink(__dirname+'/../public/images/birds/'+item.image, function(err){});
                    fs.unlink(__dirname+'/../public/images/birds/th_'+item.image, function(err){});
                }
    
                item.remove();  
                res.send({
                    status:'ok'
                });
            }else{
                res.send({
                    status:'not found'
                });
            }
        });
    
}

placeImage = function(fileName, storeName, gravity, oldName){
    
    if(fileName && fileName!='' && storeName){
        im.convert([fileName, 
            //                        '-resize', '50%', 
            //                        '-crop', '200x100+0+0',
            '-thumbnail', '200x120^',
            '-gravity', gravity || 'center',
            '-extent', '200x120',
            //                        '-page', '+0+0', __dirname+'/../public/images/frame.png', '-flatten',
            __dirname+'/../public/images/birds/th_'+storeName],
    
            function(err){
                console.log({
                    fileName:fileName, 
                    storeName:storeName, 
                    gravity:gravity, 
                    oldName:oldName
                });
                if(err){
                    throw err;
                }
                fs.rename(fileName, __dirname+'/../public/images/birds/'+storeName);
            //delete prev files
                    
                            
            });
    }
        
    if(oldName){
        fs.unlink(__dirname+'/../public/images/birds/'+oldName, function(err){});
        fs.unlink(__dirname+'/../public/images/birds/th_'+oldName, function(err){});    
    }
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
                    
                    
                    if(!isValidImageExt(ext))
                        fName = '';
                    
                    placeImage( req.files.img.path, fName, req.body.gravity, item.image );
                    

                    
                    item.image = fName;
                        
                    item.save(function(){
                        res.redirect('/'/*+item._id.toHexString()*/);
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
