
var express = require('express')
, routes = require('./routes')
, birds = require('./routes/birds')
, http = require('http')
, path = require('path')
, util = require('util')
, flash = require('connect-flash')
;
  
var mongoose = require('mongoose');

var connString = process.env.mongolabConnString;
global.db = mongoose.createConnection(connString);  

global.passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;



var auth = require('./routes/auth');
    
var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 1337);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', {
        layout : 'layout.jade'
    });
    app.use(express.favicon());
    app.use(express.bodyParser());
    app.use(express.cookieParser()); 
    app.use(express.session({
        secret:'secret',
        maxAge: new Date(Date.now() + 3600000)/*,
    store: new MongoStore(
        {db:mongoose.connection.db},
        function(err){
            console.log(err || 'connect-mongodb setup ok');
        })*/
    }));
    app.use(flash());
    app.use(express.limit('5mb')); // for file uploading


    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.logger('dev'));
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});



app.configure('development', function(){
    app.use(express.errorHandler());
    db.on('error', console.error.bind(console, 'connection error:'));
});

var noAuth = false;

function requireRole(role) {
    return function(req, res, next) {
        if(noAuth || (req.user && req.user.role === role))
            next();
        else
            res.send(403);
    }
}


app.get('/', routes.index);

app.del('/birds/:id', requireRole('admin'), birds.del);


app.post('/birds', requireRole('admin'), birds.add);
app.put('/birds/:id', requireRole('admin'), birds.edit);

app.get('/birds/new', requireRole('admin'), birds.newForm);
app.get('/birds/:id/edit', requireRole('admin'), birds.editForm);
app.get('/birds/:id/image', birds.getImage);
app.get('/birds/:id', birds.get);
app.get('/birds', birds.getAll);



app.post('/login',
    passport.authenticate('local', {
        //     failureRedirect: '/login', 
        //     failureFlash: true
        }),
    function(req, res) {
      res.send(req.user);
    });
    
app.get('/user', function(req,res){
    res.send({user:req.user});
});
  
app.get('/login', function(req, res){
    res.render('login', {
        user: req.user, 
        message: req.flash('error')
    });
});  
  
app.get('/logout', function(req, res){
    req.logout();
    res.send({result:'ok'});
//    res.redirect('/');
});

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
