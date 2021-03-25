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
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const targetDay = formatTimeStamp(timestamp);
  return daysOfWeek[targetDay.getDay()];
};

// Modified to calculate user TZ based on client local time
const changeToUserTZ = function(timestamp, userTZ) {
  // changeToUserTZ('2021-03-16T07:29:39.503Z', 'Asia/Singapore')
  const targetDatetime = formatTimeStamp(timestamp);
  // const timeString = targetDatetime.toLocaleString('en-US',{ timeZone: userTZ})
  
  return new Date(Date.UTC(targetDatetime.getFullYear(), targetDatetime.getMonth(), targetDatetime.getDate(), targetDatetime.getHours(), targetDatetime.getMinutes(), targetDatetime.getSeconds()));
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
    SUN: 0
    MON: 1
    TUE: 2
    WED: 3
    THU: 4
    FRI: 5
    SAT: 6
  */

  const today = formatTimeStamp(targetDate);
  let daysFromSun = today.getDay(); // getDay defaults to browser local time, may want to convert this to the local time according to the user's stored timezone.
  let daysFromSat = 6 - today.getDay();
  let daysBeforeToday = [];
  let daysAfterToday = [];

  // get dates before today up till monday
  while (daysFromSun > 0) {
    // deep copy of today object
    let newDate = new Date(today.getTime());
    newDate.setDate(newDate.getDate() - daysFromSun);
    daysBeforeToday.push(newDate.getDate());
    daysFromSun --;
  }

  // get dates after today up till sunday
  for (let dayAfter = 1; dayAfter <= daysFromSat; dayAfter++) {
    // deep copy of today object
    let newDate = new Date(today.getTime());
    newDate.setDate(newDate.getDate() + dayAfter);
    daysAfterToday.push(newDate.getDate());
  }

  return [...daysBeforeToday, today.getDate(), ...daysAfterToday]
};

const getWeekDateTimes = function(targetDate = new Date()) {
  /*
    JS Date.getDay()
    SUN: 0
    MON: 1
    TUE: 2
    WED: 3
    THU: 4
    FRI: 5
    SAT: 6
  */

  const today = formatTimeStamp(targetDate);
  let daysFromSun = today.getDay(); 
  let daysFromSat = 6 - today.getDay();
  let daysBeforeToday = [];
  let daysAfterToday = [];

  // get dates before today up till monday
  while (daysFromSun > 0) {
    // deep copy of today object
    let newDate = new Date(today.getTime());
    newDate.setDate(newDate.getDate() - daysFromSun);
    daysBeforeToday.push(newDate);
    daysFromSun --;
  }

  // get dates after today up till sunday
  for (let dayAfter = 1; dayAfter <= daysFromSat; dayAfter++) {
    // deep copy of today object
    let newDate = new Date(today.getTime());
    newDate.setDate(newDate.getDate() + dayAfter);
    daysAfterToday.push(newDate);
  }

  return [...daysBeforeToday, today, ...daysAfterToday]
};

const autoGenerateEmptyAppointments = function() {
  let emptyAppointments = {};
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  for (const day of weekDays) {
    emptyAppointments[day] = {};
    let hour = 0;
    let minute = 0;
    
    while (hour < 24) {
      let timeString = generateTimeString(hour, minute);
      emptyAppointments[day][timeString] = { hour: hour, minute: minute, 'session_users': [] };
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

// helper function for rebuildAppointmentObjs
const adaptSessionObj = function(sessionObj, userTZ) {
  const startTimeUserTZ = changeToUserTZ(sessionObj.start_time, userTZ);
  const dayOfWeek = extractDayOfWeek(startTimeUserTZ);
  const startTimeString = extractTimeString(startTimeUserTZ);

  return {
    'id': sessionObj.session_id,
    'day': dayOfWeek,
    'start_time': startTimeUserTZ,
    'start_time_ref': startTimeString,
    'activity_type': sessionObj.workout_type,
    'session_users': sessionObj.session_users.map( userJSONObj => JSON.parse(userJSONObj)),
    'session_uuid' : sessionObj.session_uuid,
  }
}

const rebuildAppointmentObjs = function(emptyAppointments, persistentAppointments, allAppointments, userTZ) {
  // deep copy emptyAppointments
  // let reconstructedAppointments = {...emptyAppointments};

  // reconstruct emptyAppointments
  let reconstructedAppointments = autoGenerateEmptyAppointments();
  // console.log(reconstructedAppointments);

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
    const currentAppointment = adaptSessionObj(appointment, userTZ);
    
    if (reconstructedAppointments[currentAppointment.day][currentAppointment.start_time_ref].session_users.length > 0) {
      // add the existing appointment to the pool so it can be considered for the matching algorithm. Wrap in `if` statement so we don't keep adding that same appointment to the pool.
      if (!sameSlotAppointments[currentAppointment.day] || !sameSlotAppointments[currentAppointment.day][currentAppointment.start_time_ref]) {
        // add `if` so the previous dups don't get overwritten
        if (!sameSlotAppointments[currentAppointment.day]) {
          sameSlotAppointments[currentAppointment.day] = {};
        }
        sameSlotAppointments[currentAppointment.day][currentAppointment.start_time_ref] = [reconstructedAppointments[currentAppointment.day][currentAppointment.start_time_ref]];
      }

      // add the next appointment to the list
      sameSlotAppointments[currentAppointment.day][currentAppointment.start_time_ref].push(currentAppointment);

    } else {
      reconstructedAppointments[currentAppointment.day][currentAppointment.start_time_ref] = currentAppointment;
    }
  }

  // reassign timeslots where there are conflicts
  for (const day in sameSlotAppointments) {
    for (const timeslot in sameSlotAppointments[day]) {
      // assign an appointment through the matchmaker
      reconstructedAppointments[day][timeslot] = matchMake(sameSlotAppointments[day][timeslot]);
    }
  }

  for (const appointment of persistentAppointments) {
    const currentAppointment = adaptSessionObj(appointment, userTZ);
    reconstructedAppointments[currentAppointment.day][currentAppointment.start_time_ref] = currentAppointment;
  }

  return reconstructedAppointments;
};

// replace with static var after finalizing formats
const allSlots = autoGenerateEmptyAppointments();

export {
  allSlots,
  formatTimeStamp,
  extractTimeString,
  extractDayOfWeek,
  changeToUserTZ,
  getWeekDates,
  getWeekDateTimes,
  rebuildAppointmentObjs
};