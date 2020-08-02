const mongoose = require('mongoose'),
      PunchTime = require('./punch'),
      moment = require('moment'),
      cm = require('../custom_modules/cm');


randomNum = function(range){
  var nmbr = Math.floor(Math.random() * range);
  return nmbr;
}

      //seed db file
function GenSeed(clock, clientArr, jobArr, i){
  this.daySlot = (186 + i);
  this.clientInfo = clientArr[randomNum(3)];
  this.jobInfo = jobArr[randomNum(3)];
  let c1 = clock + randomNum(1000000);
  this.clockIn = c1;
  let c2 = clock + randomNum(30000000);
  this.clockOut = c2;
  this.earnedHours = ((c2 - c1) * 0.00000028).toFixed(2);
  this.updates = [];
}     

var seeds = []
const clientArr = ['Google', 'Apple', 'Amazon'],
      jobArr = ['Site Redesign', 'Consulting', 'Front End JavaScript'];

var   timeStart = (1595708011265-23600000)-(86400000*21);

for(let i = 0; i < 28; i++){
  var hold = new GenSeed(timeStart, clientArr, jobArr, i);
  timeStart += 86400000;
  seeds.push(hold);
}

async function seedb(){
  try{
    await PunchTime.deleteMany({});
    console.log('punches removed');
    for(const seed of seeds){
      let punchTime = await PunchTime.create(seed);
      punchTime.save();      
    }
  } catch(err) {
    console.log(err);
  }
}

console.log('Seeds ' + (seeds.length + 1));


module.exports = seedb;