const moment = require('moment');
const e = require('express');

var cm = { 
  displayPunch: function (punchArr){
    let shiftArr = [];
    for(var i in punchArr){
      let shiftObj = {};
      if (punchArr[i].clockIn){
        shiftObj.clockIn = moment(punchArr[i].clockIn).format('ddd MMM Do hh:mm a'); //readable form
      }  
      if(punchArr[i].clockOut){
        shiftObj.clockOut = moment(punchArr[i].clockOut).format('ddd MMM Do hh:mm a');
      }
      shiftObj.username = punchArr[i].username;
      shiftObj.daySlot = punchArr[i].daySlot;
      shiftObj.clientInfo = punchArr[i].clientInfo;
      shiftObj.jobInfo = punchArr[i].jobInfo;
      shiftObj._id = punchArr[i]._id;
      shiftObj.earnedHours = punchArr[i].earnedHours;
      shiftArr.push(shiftObj);
    }
    return shiftArr.reverse(); //reverses the array so that the newest item is first
  },
  displayPunchObj: function (punchObj){
    let shiftObj = {};
    if (punchObj.clockIn){
      shiftObj.clockIn = moment(punchObj.clockIn).format('YYYY-MM-DDTHH:mm'); //format for datetime-local form input
    }  
    if(punchObj.clockOut){
      shiftObj.clockOut = moment(punchObj.clockOut).format('YYYY-MM-DDTHH:mm');
    }
    shiftObj.username = punchObj.username;
    shiftObj.daySlot = punchObj.daySlot;
    shiftObj.clientInfo = punchObj.clientInfo;
    shiftObj.jobInfo = punchObj.jobInfo;
    shiftObj._id = punchObj._id;
    shiftObj.earnedHours = punchObj.earnedHours;
    return shiftObj;
  },
  weekData: [
    { daySlot: 0, pArr: [] }, //sunday = 0
    { daySlot: 0, pArr: [] }, //monday = 1
    { daySlot: 0, pArr: [] }, //tuesday = 2
    { daySlot: 0, pArr: [] }, //wednesday = 3
    { daySlot: 0, pArr: [] }, // thurs = 4
    { daySlot: 0, pArr: [] }, // friday = 5
    { daySlot: 0, pArr: [] }, //saturday = 6
    ],
  getToday: () => parseInt( moment().format('DDD'), 10),
  getDayIndex: () => parseInt( moment().format('d'), 10),
  weekStart: 0, //sunday default
  weekTotals: [ 0, 0, 0, 0, 0, 0, 0],
  weekCalc: function(data){
    let today = this.getToday(); // which day of the year is today
    let dayIndex = this.getDayIndex(); //0 for sunday, 1 for monday, and so on
    if(dayIndex > 0){ //is today later than sunday?
      for(i = dayIndex; i >= 0; i--){
        this.weekData[i].daySlot = today; //assign each weekdata array-object a day number (of 365 days)
        today -= 1;
      }
    } else { //today is sunday
      this.weekData[0].daySlot = today;
    }
    if(data.constructor === Array){  //for array input
      let today = this.getToday();
      data.forEach(function (el){
        if(el.daySlot >= ( today - dayIndex )){ //push only the items for this week
          let offset = el.daySlot - today; //determine which day of the week this item belongs to
          
          cm.weekData[dayIndex+offset].pArr.push(el); //push item to array index 
          cm.weekTotals[dayIndex+offset] += el.earnedHours; //add up earnedHours
        }
      });
    } else { //for obj input 
      let today = this.getToday();
      let offset = data.daySlot - today; //determine which day of the week this item belongs to
      this.weekData[dayIndex+offset].pArr.push(data); //push item to array index 
      this.weekTotals[dayIndex+offset] += data.earnedHours; //add up earnedHours
    }
    console.log(cm.weekData);
    console.log(cm.weekTotals);
  },   
  weekStatsInit: false //flag so that the intialization does not run more than once
    
  
  

}
module.exports = cm;