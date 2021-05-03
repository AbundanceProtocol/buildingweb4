const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { JWT_SECRET }= require('./config/index');
const User = require('./models/User');
const LocalStrategy = require('passport-local').Strategy;

// JSON Web Token Strategy
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try {
        console.log(payload)
        // Find user specified in token
        const user = await User.findById(payload.sub);
        // If no user, handle it
        if (!user) {
            console.log('Not a verified user')
            return done(null, false);
        }
        // Else, return user
        done(null, user);
    } catch(error) {
        done(error, false);
    }
}));

// Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email'
  }, async (email, password, done) => {
    try {
      // Find the user given the email
      const user = await User.findOne({ email });
      // If not, handle it
      if (!user) {
        console.log('Not a verified user')
        return done(null, false);
      }
    
      // Check if the password is correct
      const isMatch = await user.isValidPassword(password);
      // If not, handle it
      if (!isMatch) {
        console.log('Password doesn\'t match')
        return done(null, false);
      }
    
      // Otherwise, return the user
      done(null, user);
    } catch(error) {
        console.log('error 3')
      done(error, false);
    }
  }));


