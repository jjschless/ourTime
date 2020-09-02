<td><%= weekStats.sundayTotal %></td>
      <td><%= weekStats.mondayTotal %></td>
      <td><%= weekStats.tuesdayTotal %></td>
      <td><%= weekStats.wednesdayTotal %></td>
      <td><%= weekStats.thursdayTotal %></td>
      <td><%= weekStats.fridayTotal %></td>
      <td><%= weekStats.saturdayTotal %></td>
      <td><%= ( weekStats.saturdayTotal + weekStats.sundayTotal + weekStats.mondayTotal + weekStats.tuesdayTotal + weekStats.wednesdayTotal + weekStats.thursdayTotal + weekStats.fridayTotal ).toFixed(2) %></td>
    



  monthsFull: [
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
  ], 
  monthsShort: [
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
  ], 
  daysShort: [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
  ], 
  daysLong: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ], 
  dateFormat: function (date, type){
  // type is format style: long, short, title, slot

  // if no date is supplied '' then one will be created
  
    if(date === ''){
      date = new Date();
    }
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
      var dateString = `${this.daysShort[weekDayIndex]}, ${this.monthsShort[monthIndex]} ${day} ${hours}:${minutes}`;
    } else if (type === 'long'){
      var dateString = `${this.daysLong[weekDayIndex]}, ${this.monthsFull[monthIndex]} ${day}${ordinalSuffix} ${hours}:${minutes}`;
    } else if (type === 'title'){
      var dateString = `${this.daysLong[weekDayIndex]}, ${this.monthsFull[monthIndex]} ${day}${ordinalSuffix} ${year}`;
    } else if (type === 'slot'){
      if(day >= 0 && day <= 9){
        day = ( '0' + day ).slice(-2);
      }
      var dateString = `${monthIndex + 1}${day}${year}`;
    }
      return dateString;
  },