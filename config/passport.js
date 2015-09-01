var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var bcrypt = require('bcrypt');

var configAuth = require('./auth');

module.exports = function(passport, connection) {


  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    connection.query("SELECT * FROM users WHERE id = " + id , function(err,rows){ 
      done(err, rows[0]);
    });
  });


  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done){
    process.nextTick(function(){
      connection.query("select * from users where email = ?", [email], function(err,rows){
        if (err)
          return done(err);
        if (rows.length) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {
          // if there is no user with that email, create the user
          var newUserMysql = new Object();
        
          newUserMysql.email = email;
          newUserMysql.password = bcrypt.hashSync(password, 10);
      
          var insertQuery = "INSERT INTO users ( email, password ) values (?,?)";
          connection.query(insertQuery, [email, newUserMysql.password], function(err,rows){
            newUserMysql.id = rows.insertId;
          
            return done(null, newUserMysql);
          }); 
        } 
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, email, password, done){
      process.nextTick(function(){
        connection.query("SELECT * FROM `users` WHERE `email` = ?", [email], function(err,rows){
          if (err)
            return done(err);
          if (!rows.length) {
            return done(null, false, req.flash('loginMessage', 'No user found.'));
          } 
        
          // if the user is found but the password is wrong
          if (!bcrypt.compareSync(password, rows[0].password))
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); 
          
          // otherwise, return successful user
          console.log(rows[0])
          return done(null, rows[0]);     
        });
      });
    }
  ));


  passport.use(new FacebookStrategy({
      clientID: configAuth.facebookAuth.clientID,
      clientSecret: configAuth.facebookAuth.clientSecret,
      callbackURL: configAuth.facebookAuth.callbackURL,
      profileFields: ["emails", "displayName", "name", "hometown", "location", "gender"]
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function(){
          connection.query("SELECT * FROM `users` WHERE `facebook_email` = ?", [profile.emails[0].value], function(err, rows){
            if(err)
              return done(err);
            if(rows.length)
              return done(null, rows[0]);
            else {
              var newUser = new Object();
              newUser.facebook_id    = profile.id;
              newUser.facebook_token = accessToken;
              newUser.facebook_name  = profile.displayName;
              newUser.facebook_email = profile.emails[0].value;

              var insertQuery = "INSERT INTO users ( facebook_id, facebook_token, facebook_name, facebook_email ) values (?,?,?,?)";
              connection.query(insertQuery, [profile.id, accessToken, profile.displayName, profile.emails[0].value], function(err,rows){
                newUser.id = rows.insertId;
          
                return done(null, newUser);
              }); 
            }
          });
        });
      }

  ));


};
