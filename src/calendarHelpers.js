const formatTimeStamp = function(timestamp) {
  let newDateObj;
  if (typeof(timestamp) === 'string') {
    newDateObj = new Date(timestamp);
  } else {
    newDateObj = timestamp;
  }
  return newDateObj;
};

const extractDayOfWeek = function(timestamp) {
  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const targetDay = formatTimeStamp(timestamp);
  return daysOfWeek[targetDay.getDay()];
};

const changeToUserTZ = function(timestamp, userTZ) {
  // changeToUserTZ('2021-03-16T07:29:39.503Z', 'Asia/Singapore')
  const targetDatetime = formatTimeStamp(timestamp);
  const timeString = targetDatetime.toLocaleString('en-US',{ timeZone: userTZ}).toString();
  return new Date(timeString);
};

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

const extractTimeString = function(timestamp) {
  const targetTime = formatTimeStamp(timestamp);
  return generateTimeString(targetTime.getHours(), targetTime.getMinutes());
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
    daysBeforeToday.push(newDate.getDate());
    daysFromMon --;
  }

  // get dates after today up till sunday
  for (let dayAfter = 1; dayAfter <= daysFromSun; dayAfter++) {
    // deep copy of today object
    let newDate = new Date(today.getTime());
    newDate.setDate(newDate.getDate() + dayAfter);
    daysAfterToday.push(newDate.getDate());
  }

  return [...daysBeforeToday, today.getDate(), ...daysAfterToday]
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
// console.log(extractTimeString("2021-03-29T01:07:04.353Z"));
// console.log(changeToUserTZ(today.toString(), 'Asia/Singapore'));
// console.log(getWeekDates("2021-03-29T19:07:04.353Z"));

const rebuildAppointmentObjs = function(allAppointments, userTZ) {
  // reconstruct appointment objs considering user's timezone and provide day of week for sorting
  let reconstructedAppointments = [];
  for (const appointment of allAppointments) {
    const startTimeUserTZ = changeToUserTZ('', userTZ);
    reconstructedAppointments.push(
      {
        'id': null,
        'owner_name': null,
        'owner_pic': null,
        'day': extractDayOfWeek(startTimeUserTZ),
        'startTime': startTimeUserTZ,
        'activityType': null
      }
    )
  }
  return reconstructedAppointments;
}

const replaceEmptySessions = function(allAppointments, bookedAppointments) {
  // for (const appointment in all)
};



const allAppointments = autoGenerateEmptyAppointments();

module.exports = {
  allAppointments,
  extractTimeString,
  extractDayOfWeek,
  changeToUserTZ,
  getWeekDates
}