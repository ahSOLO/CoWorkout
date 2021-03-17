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
      emptyAppointments[day][timeString] = { 'state': 'empty', 'session_users': [] };
      minute += 15;
      if (minute === 60) {
        hour += 1;
        minute = 0;
      }
    };
  }
  return emptyAppointments;
};

// helper function for rebuildAppointmentObjs
const matchMake = function(sessionPool) {
  // just return a random session for now
  return sessionPool[Math.floor(Math.random() * Math.floor(sessionPool.length))];
};

const rebuildAppointmentObjs = function(emptyAppointments, allAppointments, userTZ) {
  // deep copy emptyAppointments
  let reconstructedAppointments = {...emptyAppointments};

  // contains appointments that are on the same timeslot
  let sameSlotAppointments = {
    /* EXAMPLE
    'MON': {
      '03:00': [
        { appointmentObj },
        { appointmentObj },
        { appointmentObj }
      ],
      '03:30': [
        { appointmentObj },
        { appointmentObj }
      ]
    },
    'TUE': {
      // ...
    }
    */
  };

  for (const appointment of allAppointments) {
    const startTimeUserTZ = changeToUserTZ(appointment.start_time, userTZ);
    const dayOfWeek = extractDayOfWeek(startTimeUserTZ);
    const startTimeString = extractTimeString(startTimeUserTZ);
    
    if (reconstructedAppointments[dayOfWeek][startTimeString].state !== 'empty') {

      // add the existing appointment to the pool so it can be considered for the matching algorithm. Wrap in `if` statement so we don't keep adding that same appointment to the pool.
      if (!sameSlotAppointments[dayOfWeek] || !sameSlotAppointments[dayOfWeek][startTimeString]) {
        // add `if` so the previous dups don't get overwritten
        if (!sameSlotAppointments[dayOfWeek]) {
          sameSlotAppointments[dayOfWeek] = {};
        }
        sameSlotAppointments[dayOfWeek][startTimeString] = [reconstructedAppointments[dayOfWeek][startTimeString]];
      }

      // add the next appointment to the list
      sameSlotAppointments[dayOfWeek][startTimeString].push({
        'id': appointment.id,
        'day': dayOfWeek,
        'start_time': startTimeUserTZ,
        'activity_type': appointment.activity_type,
        'session_users': appointment.session_users
      });

    } else {
      reconstructedAppointments[dayOfWeek][startTimeString] = {
        'id': appointment.id,
        'day': dayOfWeek,
        'start_time': startTimeUserTZ,
        'activity_type': appointment.activity_type,
        'session_users': appointment.session_users
      };
    }
  }

  // reassign timeslots where there are conflicts
  for (const day in sameSlotAppointments) {
    for (const timeslot in sameSlotAppointments[day]) {
      // assign an appointment through the matchmaker
      reconstructedAppointments[day][timeslot] = matchMake(sameSlotAppointments[day][timeslot]);
    }
  }

  return reconstructedAppointments;
};

// replace with static var after finalizing formats
const allSlots = autoGenerateEmptyAppointments();

module.exports = {
  allSlots,
  extractTimeString,
  extractDayOfWeek,
  changeToUserTZ,
  getWeekDates,
  rebuildAppointmentObjs
};