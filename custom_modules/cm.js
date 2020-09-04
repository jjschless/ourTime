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
  getToday: () => parseInt( moment().format('DDD'), 10),
  getDayIndex: () => parseInt( moment().format('d'), 10),
  weekStart: 0, //sunday default
  weekCalc: function(data){
    let calc = [ 0, 0, 0, 0, 0, 0, 0];
    let today = this.getToday(); // which day of the year is today
    let dayIndex = this.getDayIndex(); //0 for sunday, 1 for monday, and so on
    if(data.constructor === Array){  //for array input
      let today = this.getToday();
      data.forEach(function (el){
        if(el.daySlot >= ( today - dayIndex )){ //push only the items for this week
          let offset = el.daySlot - today; //determine which day of the week this item belongs to
          calc[dayIndex+offset] += el.earnedHours; //add up earnedHours
        }
      });
    } else { //for obj input 
      let today = this.getToday();
      let offset = data.daySlot - today; //determine which day of the week this item belongs to
      calc[dayIndex+offset] += data.earnedHours; //add up earnedHours
    }
    console.log(calc);
    return calc;
  }
    
  
  

}
module.exports = cm;