const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      moment = require('moment'),
      PunchTime = require('./models/punch'),
      seedb = require('./models/seedb');

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
app.get('/', async function (req, res){
  let punchArr = await PunchTime.find({ username: { $in: 'JJ'} });
  shiftArr = displayPunch(punchArr);
  todaySend = dateFormat('', 'title');
  console.log(shiftArr);
  res.render('index', { punchArr : shiftArr, today : todaySend });
});

app.post('/punch', async function(req, res){
  try{
    if(!req.body.ourTime.Id){
      let newPunch = {
        clientInfo: req.body.ourTime.clientInfo,
        jobInfo: req.body.ourTime.jobInfo,
        clock: Date.now(),
        flag: 'in',
        daySlot: dateFormat('', 'slot')
      }
      await PunchTime.create(newPunch, function(err, newClock){
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
    } else if (req.body.ourTime.Id){
      let workingCopy = await PunchTime.findById(req.body.ourTime.Id);
      let newPunch = {
        clientInfo: workingCopy.clientInfo,
        jobInfo: workingCopy.jobInfo,
        clock: Date.now(),
        flag: 'out',
        daySlot: dateFormat('', 'slot'),
        ref: req.body.ourTime.Id
      }
      await PunchTime.create(newPunch, function(err, newPunch){
        console.log('Create done');
        if(err){
          console.log(err);
          res.redirect('/');
        } else {
          res.redirect('/');
          console.log(newPunch);
          console.log('create success');
        }
      });
      await PunchTime.findByIdAndUpdate(req.body.ourTime.Id, {ref: newPunch._id}, function(err, updateClock){
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
    } else {
      res.redirect('/');
    }
  } catch(err) {
  console.log(err);
  }
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
function displayPunch(punchArr){
  let shiftArr = [];
  for(var i in punchArr){
    let shiftObj = {};
    shiftObj.displayClock = dateFormat((punchArr[i].clock), 'short');
    shiftObj.username = punchArr[i].username;
    shiftObj.clientInfo = punchArr[i].clientInfo;
    shiftObj.jobInfo = punchArr[i].jobInfo;
    shiftObj.flag = punchArr[i].flag;
    shiftObj._id = punchArr[i]._id;
    shiftArr.push(shiftObj);
  }
  return shiftArr;
}




function dateFormat (date, type){
  // type is format style: long, short, title, slot
  // if no date is supplied '' then one will be created
  if(date === ''){
    date = new Date();
  } 
  
  const monthsFull = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const monthsShort = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  const daysShort = [
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
  ]

  const daysLong = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ]

  let year = date.getFullYear(),
      monthIndex = date.getMonth(),
      day = date.getDate(),
      weekDayIndex = date.getDay(),
      hours = date.getHours(),
      minutes = date.getMinutes();

  if(type === 'short'){
    var dateString = `${daysShort[weekDayIndex]}, ${monthsShort[monthIndex]} ${day} ${hours}:${minutes}`;
  } else if (type === 'long'){
    var dateString = `${daysLong[weekDayIndex]}, ${monthsFull[monthIndex]} ${day} ${hours}:${minutes}`;
  } else if (type === 'title'){
    var dateString = `${daysLong[weekDayIndex]}, ${monthsFull[monthIndex]} ${day} ${year}`;
  } else if (type === 'slot'){
    var dateString = `${monthIndex + 1}${day}${year}`;
  }
  console.log(dateString);
  return dateString;
}




app.listen(3000, function(){
  console.log('ourTime online');
});