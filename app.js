const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      moment = require('moment'),
      PunchTime = require('./models/punch'),
      seedb = require('./models/seedb'),
      cm = require('./custom_modules/cm');

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


seedb();

var weekStats = { 
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
    let today = new Date;
    let todaySlot = cm.dateFormat(today, 'slot');
    let dayIndex = today.getDay();
    console.log(dayIndex);
    let aQuery = (el) => el.daySlot == todaySlot;
    for(dayIndex; dayIndex >= 0; dayIndex--){
      clone = arr.filter(aQuery);
      console.log(clone);
      if(dayIndex === 6){
        let o = clone.length - 1
        for(let i = 0; i <= o; i++){
          this.saturdayPunches.push(clone[0]);
          clone.shift();
        }
        todaySlot -= 10000;  
      } else if(dayIndex === 5){
        let o = clone.length - 1
        for(let i = 0; i <= o; i++){
          this.fridayPunches.push(clone[0]);
          clone.shift();
        }
        todaySlot -= 10000;  
      } else if(dayIndex === 4){
        let o = clone.length - 1
        for(let i = 0; i <= o; i++){
          this.thursdayPunches.push(clone[0]);
          clone.shift();
        }
        todaySlot -= 10000;  
      } else if(dayIndex === 3){
        let o = clone.length - 1
        for(let i = 0; i <= o; i++){
          this.wednesdayPunches.push(clone[0]);
          clone.shift();
        }
        todaySlot -= 10000;  
      } else if(dayIndex === 2){
        let o = clone.length - 1
        for(let i = 0; i <= o; i++){
          this.tuesdayPunches.push(clone[0]);
          clone.shift();
        }
        todaySlot -= 10000;  
      } else if(dayIndex === 6){
        let o = clone.length - 1
        for(let i = 0; i <= o; i++){
          this.mondayPunches.push(clone[0]);
          clone.shift();
        }
        todaySlot -= 10000;  
      } else {
        let o = clone.length - 1
        for(let i = 0; i <= o; i++){
          this.saturdayPunches.push(clone[0]);
          clone.shift();
        } 
      } 
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
  let todaySend = cm.dateFormat('', 'title');
  let todaySlotSend = cm.dateFormat('', 'slot');
  // console.log(shiftArr);
  weekStats.weekCalc(punchArr);
  res.render('index', { punchArr : shiftArr, today : todaySend, todaySlot: todaySlotSend });
});

app.post('/punch-in', function(req, res){
  let newPunch = {
    daySlot: cm.dateFormat('', 'slot'),
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

app.post('/punch-out', async function(req, res){
  var workingCopy = await PunchTime.findById(req.body.ourTime.Id);
  console.log(workingCopy);
  var sumHours = ((Date.now() - workingCopy.clockIn) * 0.00000028).toFixed(2) 
  await PunchTime.findByIdAndUpdate(req.body.ourTime.Id, {clockOut: Date.now(), earnedHours: sumHours}, function(err, updateClock){
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








app.listen(3000, function(){
  console.log('ourTime online');
});