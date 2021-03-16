const formatTimeStamp = function(timestamp) {
  let newDateObj;
  if (typeof(timestamp) === 'string') {
    newDateObj = new Date(timestamp);
  } else {
    newDateObj = timestamp;
  }
  return newDateObj;
};

const extractTimeString = function(timestamp) {
  const timeString = formatTimeStamp(timestamp).toString();
  // 'Tue Mar 16 2021 12:02:21 GMT-0700 (Pacific Daylight Time)'
  return timeString.substring(16,21);
};

const extractDayOfWeek = function(timestamp) {
  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const targetDay = formatTimeStamp(timestamp);
  return daysOfWeek[targetDay.getDay()];
};

const changeToUserTZ = function(timestamp, userTZ) {
  // changeToUserTZ('2021-03-16T07:29:39.503Z', 'Asia/Singapore')
  // output: 2021-03-16, 12:29:39 a.m

  const targetDatetime = formatTimeStamp(timestamp);
  return targetDatetime.toLocaleString({ timeZone: userTZ});
  // return targetDatetime.toLocaleString('en-US', { timeZone: userTZ}); // can specify output format
};

// const replaceEmptySessions = function(allAppointments, bookedAppointments) {
//   for (const appointment in all)
// };

const generateTimeString = function(hour, minute) {
  // takes in ints and returns a time string in the "01:45" format
  let hourString = hour.toString();
  let minuteString = minute.toString();
  if (hourString.length !== 2) {
    hourString = "0" + hourString;
  }
  if (minuteString.length !== 2) {
    minuteString = "0" + minuteString;
  }
  return hourString + ':' + minuteString;
};

const getWeekDates = function(targetDate = new Date()) {
  /*
    JS Date.getDay()
    MON: 0
    TUE: 1
    WED: 2
    THU: 3
    FRI: 4
    SAT: 5
    SUN: 6
  */

  const today = formatTimeStamp(targetDate);
  let daysFromMon = today.getDay();
  let daysFromSun = 6 - today.getDay();
  let daysBeforeToday = [];
  let daysAfterToday = [];

  // get dates before today up till monday
  while (daysFromMon > 0) {
    // deep copy of today object
    let newDate = new Date(today.getTime());
    newDate.setDate(newDate.getDate() - daysFromMon);
    daysBeforeToday.push(newDate);
    daysFromMon --;
  }

  // get dates after today up till sunday
  for (let dayAfter = 1; dayAfter <= daysFromSun; dayAfter++) {
    // deep copy of today object
    let newDate = new Date(today.getTime());
    newDate.setDate(newDate.getDate() + dayAfter);
    console.log('new date:', newDate);
    daysAfterToday.push(newDate);
  }

  return [...daysBeforeToday, today, ...daysAfterToday]
};

const autoGenerateEmptyAppointments = function() {
  let emptyAppointments = {};
  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  for (const day of weekDays) {
    emptyAppointments[day] = {};
    let hour = 0;
    let minute = 0;
    
    while (hour < 24) {
      let timeString = generateTimeString(hour, minute);
      emptyAppointments[day][timeString] = { 'status': 'empty' };
      minute += 15;
      if (minute === 60) {
        hour += 1;
        minute = 0;
      }
    };
  }
  return emptyAppointments;
};

// // examples
// let today = new Date();
// console.log(extractDayOfWeek(today.toString()));
// console.log(extractTimeString(today.toString()));
// console.log(changeToUserTZ(today.toString(), 'Asia/Singapore'));
// console.log(getWeekDates("2021-03-29T19:07:04.353Z"));




const allAppointments = autoGenerateEmptyAppointments();

module.exports = {
  allAppointments,
  extractTimeString,
  extractDayOfWeek,
  changeToUserTZ
}