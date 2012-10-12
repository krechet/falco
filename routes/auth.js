
var crypto = require('crypto');

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


