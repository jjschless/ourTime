const mongoose = require('mongoose'),
      PunchTime = require('./punch'),
      cm = require('../custom_modules/cm');

//seed db file
function GenSeed(clock, clientArr, jobArr, r, i){
  this.daySlot = (7042020 + (10000 * i));
  this.clientInfo = clientArr[r];
  this.jobInfo = jobArr[r];
  this.clockIn = clock;
  this.clockOut = (clock + 30000000);
  this.earnedHours = 30000000;
  this.updates = [];
}     

var seeds = []
const clientArr = ['MicroSoft', 'Google', 'Apple', 'Spotify', 'Apple', 'Spotify', 'MicroSoft', 'Google'],
      jobArr = ['Site Redesign', 'Consulting', 'Front End JavaScript', 'Node Refactor', 'Site Redesign', 'Consulting', 'Front End JavaScript', 'Node Refactor'];

var   timeStart = (1595708011265-23600000)-(86400000*21);

var r = 0;
for(let i = 0; i < 28; i++){
  if(r === 8){
    r = 0;
  }
  var hold = new GenSeed(timeStart, clientArr, jobArr, r, i);
  timeStart += 86400000;
  seeds.push(hold);
  console.log('seed created');
  r += 1
}
console.log('Seeds ' + (seeds.length + 1));

async function seedb(){
  try{
    await PunchTime.deleteMany({});
    console.log('punches removed');
    for(const seed of seeds){
      let punchTime = await PunchTime.create(seed);
      punchTime.save();      
      console.log('seed added');
    }
  } catch(err) {
    console.log(err);
  }
}

module.exports = seedb;