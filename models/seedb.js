const mongoose = require('mongoose'),
      PunchTime = require('./punch');

//seed db file


seeds = [
  {
    daySlot: 7252020,
    clientInfo: 'MicroSoft',
    jobInfo: 'Site Redesign',
    clockIn: (1595708011265-3600000),
    clockOut: 1595708011265,
    earnedHours: 3600000,
    updates: []
  },
  {
    daySlot: 7252020,
    clientInfo: 'MicroSoft',
    jobInfo: 'Site Redesign Part 2',
    clockIn: (1595708011265-13600000),
    clockOut: (1595708011265-20000000),
    earnedHours: ((1595708011265-13600000) - (1595708011265-20000000)),
    updates: []
  },
  {
    daySlot: 7242020,
    clientInfo: 'Amazon',
    jobInfo: 'Build a widget',
    clockIn: (1595708011265-83600000),
    clockOut: (1595708011265-77800000),
    earnedHours: ((1595708011265-77800000) - (1595708011265-83600000)),
    updates: []
  },
  {
    daySlot: 7232020,
    clientInfo: 'Spotify',
    jobInfo: 'Consulting',
    clockIn: (1595708011265-183600000),
    clockOut: (1595708011265-177800000),
    earnedHours: ((1595708011265-177800000) - (1595708011265-183600000)),
    updates: []
  },
  {
    daySlot: 7222020,
    clientInfo: 'Spotify',
    jobInfo: 'Consulting',
    clockIn: (1595708011265-283600000),
    clockOut: (1595708011265-277800000),
    earnedHours: ((1595708011265-277800000) - (1595708011265-283600000)),
    updates: []
  }
]
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