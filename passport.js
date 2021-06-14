const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user'); 
var secret = 'super secret';

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.getUserByID(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
            session: false
          },     
        function (req, email, password, done) {
            User.getUserByEmail(email, function (err, user) {
                if (err) throw err;
                if (!user) {
                    return done(null, false, {
                        message: 'Unknown User'
                    });
                }

                User.comparePassword(password, user.password, function (err, isMatch) {
                    // console.log('comparePassword is calling..');
                    if (err) throw err;
                    if (isMatch) {                       
                        if(user.userType === 5){
                            if(req.body.companyId){
                                var compId =  req.body.companyId;
                                if(user.companyId === compId){
                                    console.log("Done");
                                    return done(null, user);
                                }else{
                                    return done(null, false, {
                                        message: 'Invalid CompanyId'
                                    });
                                }
                            }else{
                                return done(null, false, {
                                    message: 'Empty Company Id'
                                });
                            }                            
                        }else{
                            return done(null, user);
                        }                        
                    } else {
                        return done(null, false, {
                            message: 'Invalid Password'
                        });
                    }
                })
            });
        }
    ));
}