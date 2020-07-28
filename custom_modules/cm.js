var cm = { 
  dateFormat: function (date, type){
  // type is format style: long, short, title, slot

  // if no date is supplied '' then one will be created
  
    if(date === ''){
      date = new Date();
    } 
    
    // Create arrays of string names
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
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat'
    ]

    const daysLong = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ]

    // get index values based on the date
    let year = date.getFullYear(),
        monthIndex = date.getMonth(),
        day = date.getDate(),
        weekDayIndex = date.getDay(),
        hours = date.getHours(),
        minutes = date.getMinutes();

    if(minutes >= 0 && minutes <= 9){
      minutes = ('0' + minutes).slice(-2);
    }

    // determine ordinal suffix
    if(day === 1 || day === 21 || day === 31){
      var ordinalSuffix = 'st';
    } else if (day === 2 || day === 22) {
      var ordinalSuffix = 'nd';
    } else if (day === 3 || day === 23) {
      var ordinalSuffix = 'rd';
    } else {
      var ordinalSuffix = 'th';
    }
      
    // 4 variations of output
    if(type === 'short'){
      var dateString = `${daysShort[weekDayIndex]}, ${monthsShort[monthIndex]} ${day} ${hours}:${minutes}`;
    } else if (type === 'long'){
      var dateString = `${daysLong[weekDayIndex]}, ${monthsFull[monthIndex]} ${day}${ordinalSuffix} ${hours}:${minutes}`;
    } else if (type === 'title'){
      var dateString = `${daysLong[weekDayIndex]}, ${monthsFull[monthIndex]} ${day}${ordinalSuffix} ${year}`;
    } else if (type === 'slot'){
      if(day >= 0 && day <= 9){
        day = ( '0' + day ).slice(-2);
      }
      var dateString = `${monthIndex + 1}${day}${year}`;
    }
      return dateString;
  },
  displayPunch: function (punchArr){
    let shiftArr = [];
    for(var i in punchArr){
      let shiftObj = {};
      if (punchArr[i].clockIn){
        shiftObj.clockIn = this.dateFormat(punchArr[i].clockIn, 'short');
      }  
      if(punchArr[i].clockOut){
        shiftObj.clockOut = this.dateFormat(punchArr[i].clockOut, 'short');
      }
      shiftObj.username = punchArr[i].username;
      shiftObj.daySlot = punchArr[i].daySlot;
      shiftObj.clientInfo = punchArr[i].clientInfo;
      shiftObj.jobInfo = punchArr[i].jobInfo;
      shiftObj._id = punchArr[i]._id;
      shiftObj.earnedHours = punchArr[i].earnedHours;
      shiftArr.push(shiftObj);
    }
    return shiftArr;
  }
}
module.exports = cm;