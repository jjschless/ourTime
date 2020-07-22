const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/yelp_camp_v3', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
//tell express to serve the public directory 
//from the current directory __dirname to public
app.use(express.static(__dirname + '/public'));
// app.use(methodOverride('_method'));
// app.use(flash());
//wipe database and seed campground
// seedDB();

//passport config
//set up the session
// app.use(require('express-session')({
//   secret: 'jikjo iknmoi43j r29f90d uf09d 8uf',
//   resave: false,
//   saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

//setting up middleware for every route that
//will pass in the user data
app.use(function (req, res, next){
  res.locals.currentUser = req.user;
  // res.locals.error = req.flash('error');
  // res.locals.success = req.flash('success');
  // next();
});

//==============
// Routes
//==============


app.listen(3000, function(){
  console.log('ourTime online')
});