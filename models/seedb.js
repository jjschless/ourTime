const mongoose = require('mongoose'),
      PunchTime = require('./punch');

//seed db file


seeds = [
  {
    clientInfo: 'MicroSoft',
    jobInfo: 'Site Redesign',
    clockIn: (1595708011265-3600000),
    flag: 'in'
  },
  {
    clientInfo: 'MicroSoft',
    jobInfo: 'Site Redesign',
    clock: 1595708011265,
    flag: 'out'
  },
  {
    clientInfo: 'MicroSoft',
    jobInfo: 'Site Redesign Part 2',
    clock: (1595708011265-13600000),
    flag: 'in'
  },
  {
    clientInfo: 'MicroSoft',
    jobInfo: 'Site Redesign Part 2',
    clock: (1595708011265-20000000),
    flag: 'out'
  },
  {
    clientInfo: 'Amazon',
    jobInfo: 'Build a widget',
    clock: (1595708011265-83600000),
    flag: 'in'
  },
  {
    clientInfo: 'Amazon',
    jobInfo: 'Build a widget',
    clock: (1595708011265-77800000),
    flag: 'out'
  },
  {
    clientInfo: 'Spotify',
    jobInfo: 'Consulting',
    clock: (1595708011265-183600000),
    flag: 'in'
  },
  {
    clientInfo: 'Spotify',
    jobInfo: 'Consulting',
    clock: (1595708011265-177800000),
    flag: 'out'
  },
  {
    clientInfo: 'Spotify',
    jobInfo: 'Consulting',
    clock: (1595708011265-283600000),
    flag: 'in'
  },
  {
    clientInfo: 'Spotify',
    jobInfo: 'Consulting',
    clock: (1595708011265-277800000),
    flag: 'out'
  }
]
async function seedb(){
  try{
    // await PunchTime.deleteMany({});
    // console.log('punches removed');
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