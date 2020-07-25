const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/ourTime_v1', {
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
// seedDB();

const punchSchema = new mongoose.Schema({
  username: {type: String, default: 'JJ'},
  inOut: String,
  clientInfo: String,
  jobInfo: String,
  clockIn: Date,
  clockOut: Date,
  updates: {type: Array}
});


const PunchTime = mongoose.model('Punch', punchSchema);

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
// app.use(function (req, res, next){
//   res.locals.currentUser = req.user;
//   res.locals.error = req.flash('error');
//   res.locals.success = req.flash('success');
//   next();
// });

//==============
// Routes
//==============
app.get('/', async function (req, res){
  var punchArr = await PunchTime.find({ username: { $in: 'JJ'} });
  console.log(punchArr);
  res.render('index', { punchArr : punchArr});
});

app.post('/punch-in', function(req, res){
  let newPunch = {
    clientInfo: req.body.ourTime.clientInfo,
    jobInfo: req.body.ourTime.jobInfo,
    clockIn: Date.now()
  }
  PunchTime.create(newPunch, function(err, newClock){
    console.log('Create done');
    if(err){
      console.log(err);
      res.redirect('/');
    } else {
      res.redirect('/');
      console.log(newClock);
      console.log('create success');
    }
  });
});
  
app.post('/punch-out', function(req, res){
  console.log(req.body.ourTime.Id);
  PunchTime.findByIdAndUpdate(req.body.ourTime.Id, {clockOut: Date.now()}, function(err, updateClock){
    console.log('Update done');
    if(err){
      console.log('error with update');
      console.log(err);
      res.redirect('/');
    } else {
      res.redirect('/');
      console.log(updateClock);
      console.log('update success');
    }
  });
});

  // console.log();
  // let inOutV = req.body.ourTime.inOut;
  // let clientInfoV = req.body.ourTime.clientInfo;
  // let jobInfoV = req.body.ourTime.jobInfo;
  // let clockTimeV = Date.now();
  
  // let newPunch = {
  //   inOut: inOutV,
  //   clientInfo: clientInfoV,
  //   jobInfo: jobInfoV,
  //   clockTime: clockTimeV
  // }

  

// app.get('/index', function(req, res){
//   res.render('index');
// });


app.listen(3000, function(){
  console.log('ourTime online');
});