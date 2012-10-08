
var express = require('express')
, routes = require('./routes')
, birds = require('./routes/birds')
, http = require('http')
, path = require('path')
, util = require('util')
, flash = require('connect-flash')
, crypto = require('crypto');
  


var mongoose = require('mongoose');

global.db = mongoose.createConnection('localhost', 'test');  


var users = [
{
    id: 1, 
    username: 'user', 
    password: '0cc175b9c0f1b6a831c399e269772661', 
    email: 'a@example.com', 
    role : 'user'
}
, {
    id: 2, 
    username: 'admin', 
    password: '92eb5ffee6ae2fec3ad71c777531578f', 
    email: 'b@example.com', 
    role : 'admin'
}
];

function findById(id, fn) {
    var idx = id - 1;
    if (users[idx]) {
        fn(null, users[idx]);
    } else {
        fn(new Error('User ' + id + ' does not exist'));
    }
}

function findByUsername(username, fn) {
    for (var i = 0, len = users.length; i < len; i++) { 
        var user = users[i];
        if (user.username === username) {
            return fn(null, user);
        }
    }
    return fn(null, null);
}

var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function(username, password, done) {
        findByUsername( username, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    message: 'Unknown user'
                });
            }
            if (user.password != crypto.createHash('md5').update(password).digest('hex')) {
                return done(null, false, {
                    message: 'Invalid password'
                });
            }
            return done(null, user);
        });
    }
    ));


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    findById(id, function (err, user) {
        done(err, user);
    });
});

    
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

function requireRole(role) {
    return function(req, res, next) {
        if(req.user && req.user.role === role)
            next();
        else
            res.send(403);
    }
}


app.get('/', routes.index);

app.post('/birds', requireRole('admin'), birds.add);
app.put('/birds/:id', requireRole('admin'), birds.edit);
app.del('birds/:id', requireRole('admin'), birds.del);
app.get('/birds/new', requireRole('admin'), birds.newForm);
app.get('/birds/:id/edit', requireRole('admin'), birds.editForm);
app.get('/birds/:id', birds.get);
app.get('/birds', birds.getAll);


app.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login', 
        failureFlash: true
    }),
    function(req, res) {
        res.redirect('/');
    });
  
app.get('/login', function(req, res){
    res.render('login', {
        user: req.user, 
        message: req.flash('error')
    });
});  
  
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
