const extractTimeString = function(timestamp) {
  // expected timestamp format '2021-03-16T07:29:39.503Z'
  // output: 07:29
  const timeString = timestamp.toString();
  return timeString.substring(11,16);
};

const extractDayOfWeek = function(timestamp) {
  // expected timestamp format '2021-03-16T07:29:39.503Z'
  // output: 'WED'
  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  // check to see if timestamp is a string or a datetime object
  let newDateObj;
  if (typeof(timestamp) === 'string') {
    newDateObj = new Date(timestamp);
  } else {
    newDateObj = timestamp;
  }
  return daysOfWeek[newDateObj.getDay()];
}

const changeToUserTZ = function(timestamp, userTZ) {
  // changeToUserTZ('2021-03-16T07:29:39.503Z', 'Asia/Singapore')
  // output: 2021-03-16, 12:29:39 a.m

  // check to see if timestamp is a string or a datetime object
  let newDateObj;
  if (typeof(timestamp) === 'string') {
    newDateObj = new Date(timestamp);
  } else {
    newDateObj = timestamp;
  }
  return newDateObj.toLocaleString({ timeZone: userTZ});
  // return newDateObj.toLocaleString('en-US', { timeZone: userTZ}); // can specify output format
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
}

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
}

const allAppointments = autoGenerateEmptyAppointments();

module.exports = {
  allAppointments,
  extractTimeString,
  extractDayOfWeek,
  changeToUserTZ
}