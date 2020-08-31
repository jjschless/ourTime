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

var weekStats = { 
  init: false,
  weekStart: 'Sunday',
  sundayPunches: [],
  mondayPunches: [],
  tuesdayPunches: [],
  wednesdayPunches: [],
  thursdayPunches: [],
  fridayPunches: [],
  saturdayPunches: [],
  sundayTotal: 0,
  mondayTotal: 0,
  tuesdayTotal: 0,
  wednesdayTotal: 0,
  thursdayTotal: 0,
  fridayTotal: 0,
  saturdayTotal: 0,
  weekCalc: function(arr){
    let today = new Number(moment().format('DDD'));
    let dayIndex = moment().format('d');
    for(let x = dayIndex; x >= 0; x--){
      var aQuery = function(el){ el.daySlot == today && el.earnedHours > 0 };
      clone = arr.filter(aQuery);
      console.log(clone);
      if(dayIndex === 6){
        let o = clone.length - 1
        for(let i = 0; i <= o; i++){
          this.saturdayTotal += clone[0].earnedHours;
          this.saturdayPunches.push(clone[0]);
          clone.shift();
        }
      } else if(dayIndex === 5){
        let o = clone.length - 1
        for(let i = 0; i <= o; i++){
          this.fridayTotal += clone[0].earnedHours;
          this.fridayPunches.push(clone[0]);
          clone.shift();
        }
      } else if(dayIndex === 4){
        let o = clone.length - 1
        for(let i = 0; i <= o; i++){
          this.thursdayTotal += clone[0].earnedHours;
          this.thursdayPunches.push(clone[0]);
          clone.shift();
        } 
      } else if(dayIndex === 3){
        let o = clone.length - 1
        for(let i = 0; i <= o; i++){
          this.wednesdayTotal += clone[0].earnedHours;
          this.wednesdayPunches.push(clone[0]);
          clone.shift();
        }  
      } else if(dayIndex === 2){
        let o = clone.length - 1
        for(let i = 0; i <= o; i++){
          this.tuesdayTotal += clone[0].earnedHours;
          this.tuesdayPunches.push(clone[0]);
          clone.shift();
        } 
      } else if(dayIndex === 1){
        let o = clone.length - 1
        for(let i = 0; i <= o; i++){
          this.mondayTotal += clone[0].earnedHours;
          this.mondayPunches.push(clone[0]);
          clone.shift();
        }   
      } else {
        let o = clone.length - 1
        for(let i = 0; i <= o; i++){
          this.sundayTotal += clone[0].earnedHours;
          this.sundayPunches.push(clone[0]);
          clone.shift();
        } 
      } 
      today -= 1;
    }
  }
}

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
  let shiftArr = cm.displayPunch(punchArr);
  let todaySend = {
    title: moment().format('dddd, MMMM Do YYYY'),
    day: moment().format('DDD')
  };
  // console.log(shiftArr);
  if(!weekStats.init){
    weekStats.weekCalc(punchArr);
    weekStats.init = true;
  }
  res.render('index', { shiftArr : shiftArr, weekStats: weekStats, todaySend: todaySend});
});

app.post('/punch-in', function(req, res){
    let newPunch = {
    daySlot: moment().format('DDD'),
    clientInfo: req.body.ourTime.clientInfo,
    jobInfo: req.body.ourTime.jobInfo
  }
  if(!req.body.ourTime.clockIn){
    newPunch.clockIn = moment();
  } else {
    newPunch.clockIn = moment(req.body.ourTime.clockIn);
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

app.post('/punch-out', async function(req, res){
  console.log('req.body.ourTime.Id')
  console.log(req.body.ourTime.Id)

  var workingCopy = await PunchTime.findById(req.body.ourTime.Id);
  var sumHours = ((moment() - workingCopy.clockIn) * 0.00000028).toFixed(2); 
  await PunchTime.findByIdAndUpdate(req.body.ourTime.Id, {clockOut: moment(), earnedHours: sumHours}, function(err, updateClock){
    if(err){
      console.log('error with update');
      console.log(err);
      res.redirect('/');
   } else {
      workingCopy.clockOut = moment();
      workingCopy.earnedHours = sumHours;
      let pushArr = [];
      pushArr.push(workingCopy);
      console.log(pushArr);
      weekStats.weekCalc(pushArr);
      console.log('update success');
      res.redirect('/');
   }
 });
});


app.get('/:id/edit', async function (req, res){
  var workingCopy = await PunchTime.findById(req.params.id);
  console.log('edit workingcopy');
  console.log(workingCopy);
  res.render('edit', { shiftObj : cm.displayPunchObj(workingCopy)});
})

app.put('update/:id', function (req, res){
  let updatePunch = {
    clientInfo: req.body.ourTime.clientInfo,
    jobInfo: req.body.ourTime.jobInfo,
    clockIn: moment(req.body.ourTime.clockIn),
    clockOut: moment(req.body.ourTime.clockOut),
  }
  updatePunch.earnedHours = ((updatePunch.clockOut - updatePunch.clockIn)* 0.00000028).toFixed(2);
  PunchTime.findByIdAndUpdate(req.params.id, updatePunch, function(err, updated){
    if(err){
      res.redirect('/' + req.params.id + '/edit');
    } else {
      res.redirect('/');
    }
  })
})



app.listen(3000, function(){
  console.log('ourTime online');
});