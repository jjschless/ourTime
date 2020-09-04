const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      moment = require('moment'),
      PunchTime = require('./models/punch'),
      seedb = require('./models/seedb'),
      cm = require('./custom_modules/cm'),
      methodOverride = require('method-override');

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
app.use(methodOverride('_method'));
// app.use(flash());


// seedb();


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
//INDEX and Punch In
app.get('/', async function (req, res){
  var punchArr = await PunchTime.find({ username: { $in: 'JJ'} });
  let shiftArr = Array.from(cm.displayPunch(punchArr));
  let todaySend = {
    title: moment().format('dddd, MMMM Do YYYY'),
    day: cm.getToday()
  };
  //reset week totals and data if an edit or delete was made
  var weekTotals = cm.weekCalc(punchArr);
  res.render('index', { shiftArr : shiftArr, weekTotals: weekTotals, todaySend: todaySend});
});
//PUNCH IN
app.post('/punch-in', function(req, res){
    let newPunch = {
    daySlot: cm.getToday(),
    clientInfo: req.body.ourTime.clientInfo,
    jobInfo: req.body.ourTime.jobInfo
  }
  if(!req.body.ourTime.clockIn){
    newPunch.clockIn = moment();
  } else {
    newPunch.clockIn = moment(req.body.ourTime.clockIn);
  }
  PunchTime.create(newPunch, function(err, newClock){
    // console.log('Create done');
    if(err){
      console.log(err);
      res.redirect('/');
    } else {
      res.redirect('/');
      // console.log(newClock);
      console.log('create success');
    }
   });
 });
//PUNCH OUT
app.post('/punch-out', async function(req, res){
  // console.log('req.body.ourTime.Id')
  // console.log(req.body.ourTime.Id)

  var workingCopy = await PunchTime.findById(req.body.ourTime.Id);
  var sumHours = ((moment() - workingCopy.clockIn) * 0.00000028).toFixed(2); 
  await PunchTime.findByIdAndUpdate(req.body.ourTime.Id, {clockOut: moment(), earnedHours: sumHours}, function(err, updateClock){
    if(err){
      console.log('error with punch out');
      console.log(err);
      res.redirect('/');
   } else {
      console.log(updateClock);
      console.log('punch out success');
      res.redirect('/');
   }
 });
});

//EDIT
app.get('/:id/edit', async (req, res) => {
  var workingCopy = await PunchTime.findById(req.params.id);
  // console.log('edit workingcopy');
  // console.log(workingCopy);
  res.render('edit', { shiftObj : cm.displayPunchObj(workingCopy)});
})
//UPDATE
app.put('/update/:id', async (req, res) => {
  let updatePunch = {
    daySlot: moment(req.body.ourTime.clockIn).format('DDD'),
    clientInfo: req.body.ourTime.clientInfo,
    jobInfo: req.body.ourTime.jobInfo,
    clockIn: moment(req.body.ourTime.clockIn),
    clockOut: moment(req.body.ourTime.clockOut),
  }
  updatePunch.earnedHours = ((updatePunch.clockOut - updatePunch.clockIn)* 0.00000028).toFixed(2);
  await PunchTime.findByIdAndUpdate(req.params.id, updatePunch, function(err, updated){
    if(err){
      res.redirect('/' + req.params.id + '/edit');
    } else {
      res.redirect('/');
    }
  })
})
// DELETE
app.delete('/delete/:id', async (req, res) => {
  try {
    await PunchTime.deleteOne({_id: req.params.id});
    console.log('delete success')
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
});

app.listen(3000, function(){
  console.log('ourTime online');
});