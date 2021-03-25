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
const allSlots = {
  SUN: {
    '00:00': { hour: 0, minute: 0, session_users: [] },
    '00:15': { hour: 0, minute: 15, session_users: [] },
    '00:30': { hour: 0, minute: 30, session_users: [] },
    '00:45': { hour: 0, minute: 45, session_users: [] },
    '01:00': { hour: 1, minute: 0, session_users: [] },
    '01:15': { hour: 1, minute: 15, session_users: [] },
    '01:30': { hour: 1, minute: 30, session_users: [] },
    '01:45': { hour: 1, minute: 45, session_users: [] },
    '02:00': { hour: 2, minute: 0, session_users: [] },
    '02:15': { hour: 2, minute: 15, session_users: [] },
    '02:30': { hour: 2, minute: 30, session_users: [] },
    '02:45': { hour: 2, minute: 45, session_users: [] },
    '03:00': { hour: 3, minute: 0, session_users: [] },
    '03:15': { hour: 3, minute: 15, session_users: [] },
    '03:30': { hour: 3, minute: 30, session_users: [] },
    '03:45': { hour: 3, minute: 45, session_users: [] },
    '04:00': { hour: 4, minute: 0, session_users: [] },
    '04:15': { hour: 4, minute: 15, session_users: [] },
    '04:30': { hour: 4, minute: 30, session_users: [] },
    '04:45': { hour: 4, minute: 45, session_users: [] },
    '05:00': { hour: 5, minute: 0, session_users: [] },
    '05:15': { hour: 5, minute: 15, session_users: [] },
    '05:30': { hour: 5, minute: 30, session_users: [] },
    '05:45': { hour: 5, minute: 45, session_users: [] },
    '06:00': { hour: 6, minute: 0, session_users: [] },
    '06:15': { hour: 6, minute: 15, session_users: [] },
    '06:30': { hour: 6, minute: 30, session_users: [] },
    '06:45': { hour: 6, minute: 45, session_users: [] },
    '07:00': { hour: 7, minute: 0, session_users: [] },
    '07:15': { hour: 7, minute: 15, session_users: [] },
    '07:30': { hour: 7, minute: 30, session_users: [] },
    '07:45': { hour: 7, minute: 45, session_users: [] },
    '08:00': { hour: 8, minute: 0, session_users: [] },
    '08:15': { hour: 8, minute: 15, session_users: [] },
    '08:30': { hour: 8, minute: 30, session_users: [] },
    '08:45': { hour: 8, minute: 45, session_users: [] },
    '09:00': { hour: 9, minute: 0, session_users: [] },
    '09:15': { hour: 9, minute: 15, session_users: [] },
    '09:30': { hour: 9, minute: 30, session_users: [] },
    '09:45': { hour: 9, minute: 45, session_users: [] },
    '10:00': { hour: 10, minute: 0, session_users: [] },
    '10:15': { hour: 10, minute: 15, session_users: [] },
    '10:30': { hour: 10, minute: 30, session_users: [] },
    '10:45': { hour: 10, minute: 45, session_users: [] },
    '11:00': { hour: 11, minute: 0, session_users: [] },
    '11:15': { hour: 11, minute: 15, session_users: [] },
    '11:30': { hour: 11, minute: 30, session_users: [] },
    '11:45': { hour: 11, minute: 45, session_users: [] },
    '12:00': { hour: 12, minute: 0, session_users: [] },
    '12:15': { hour: 12, minute: 15, session_users: [] },
    '12:30': { hour: 12, minute: 30, session_users: [] },
    '12:45': { hour: 12, minute: 45, session_users: [] },
    '13:00': { hour: 13, minute: 0, session_users: [] },
    '13:15': { hour: 13, minute: 15, session_users: [] },
    '13:30': { hour: 13, minute: 30, session_users: [] },
    '13:45': { hour: 13, minute: 45, session_users: [] },
    '14:00': { hour: 14, minute: 0, session_users: [] },
    '14:15': { hour: 14, minute: 15, session_users: [] },
    '14:30': { hour: 14, minute: 30, session_users: [] },
    '14:45': { hour: 14, minute: 45, session_users: [] },
    '15:00': { hour: 15, minute: 0, session_users: [] },
    '15:15': { hour: 15, minute: 15, session_users: [] },
    '15:30': { hour: 15, minute: 30, session_users: [] },
    '15:45': { hour: 15, minute: 45, session_users: [] },
    '16:00': { hour: 16, minute: 0, session_users: [] },
    '16:15': { hour: 16, minute: 15, session_users: [] },
    '16:30': { hour: 16, minute: 30, session_users: [] },
    '16:45': { hour: 16, minute: 45, session_users: [] },
    '17:00': { hour: 17, minute: 0, session_users: [] },
    '17:15': { hour: 17, minute: 15, session_users: [] },
    '17:30': { hour: 17, minute: 30, session_users: [] },
    '17:45': { hour: 17, minute: 45, session_users: [] },
    '18:00': { hour: 18, minute: 0, session_users: [] },
    '18:15': { hour: 18, minute: 15, session_users: [] },
    '18:30': { hour: 18, minute: 30, session_users: [] },
    '18:45': { hour: 18, minute: 45, session_users: [] },
    '19:00': { hour: 19, minute: 0, session_users: [] },
    '19:15': { hour: 19, minute: 15, session_users: [] },
    '19:30': { hour: 19, minute: 30, session_users: [] },
    '19:45': { hour: 19, minute: 45, session_users: [] },
    '20:00': { hour: 20, minute: 0, session_users: [] },
    '20:15': { hour: 20, minute: 15, session_users: [] },
    '20:30': { hour: 20, minute: 30, session_users: [] },
    '20:45': { hour: 20, minute: 45, session_users: [] },
    '21:00': { hour: 21, minute: 0, session_users: [] },
    '21:15': { hour: 21, minute: 15, session_users: [] },
    '21:30': { hour: 21, minute: 30, session_users: [] },
    '21:45': { hour: 21, minute: 45, session_users: [] },
    '22:00': { hour: 22, minute: 0, session_users: [] },
    '22:15': { hour: 22, minute: 15, session_users: [] },
    '22:30': { hour: 22, minute: 30, session_users: [] },
    '22:45': { hour: 22, minute: 45, session_users: [] },
    '23:00': { hour: 23, minute: 0, session_users: [] },
    '23:15': { hour: 23, minute: 15, session_users: [] },
    '23:30': { hour: 23, minute: 30, session_users: [] },
    '23:45': { hour: 23, minute: 45, session_users: [] }
  },
  MON: {
    '00:00': { hour: 0, minute: 0, session_users: [] },
    '00:15': { hour: 0, minute: 15, session_users: [] },
    '00:30': { hour: 0, minute: 30, session_users: [] },
    '00:45': { hour: 0, minute: 45, session_users: [] },
    '01:00': { hour: 1, minute: 0, session_users: [] },
    '01:15': { hour: 1, minute: 15, session_users: [] },
    '01:30': { hour: 1, minute: 30, session_users: [] },
    '01:45': { hour: 1, minute: 45, session_users: [] },
    '02:00': { hour: 2, minute: 0, session_users: [] },
    '02:15': { hour: 2, minute: 15, session_users: [] },
    '02:30': { hour: 2, minute: 30, session_users: [] },
    '02:45': { hour: 2, minute: 45, session_users: [] },
    '03:00': { hour: 3, minute: 0, session_users: [] },
    '03:15': { hour: 3, minute: 15, session_users: [] },
    '03:30': { hour: 3, minute: 30, session_users: [] },
    '03:45': { hour: 3, minute: 45, session_users: [] },
    '04:00': { hour: 4, minute: 0, session_users: [] },
    '04:15': { hour: 4, minute: 15, session_users: [] },
    '04:30': { hour: 4, minute: 30, session_users: [] },
    '04:45': { hour: 4, minute: 45, session_users: [] },
    '05:00': { hour: 5, minute: 0, session_users: [] },
    '05:15': { hour: 5, minute: 15, session_users: [] },
    '05:30': { hour: 5, minute: 30, session_users: [] },
    '05:45': { hour: 5, minute: 45, session_users: [] },
    '06:00': { hour: 6, minute: 0, session_users: [] },
    '06:15': { hour: 6, minute: 15, session_users: [] },
    '06:30': { hour: 6, minute: 30, session_users: [] },
    '06:45': { hour: 6, minute: 45, session_users: [] },
    '07:00': { hour: 7, minute: 0, session_users: [] },
    '07:15': { hour: 7, minute: 15, session_users: [] },
    '07:30': { hour: 7, minute: 30, session_users: [] },
    '07:45': { hour: 7, minute: 45, session_users: [] },
    '08:00': { hour: 8, minute: 0, session_users: [] },
    '08:15': { hour: 8, minute: 15, session_users: [] },
    '08:30': { hour: 8, minute: 30, session_users: [] },
    '08:45': { hour: 8, minute: 45, session_users: [] },
    '09:00': { hour: 9, minute: 0, session_users: [] },
    '09:15': { hour: 9, minute: 15, session_users: [] },
    '09:30': { hour: 9, minute: 30, session_users: [] },
    '09:45': { hour: 9, minute: 45, session_users: [] },
    '10:00': { hour: 10, minute: 0, session_users: [] },
    '10:15': { hour: 10, minute: 15, session_users: [] },
    '10:30': { hour: 10, minute: 30, session_users: [] },
    '10:45': { hour: 10, minute: 45, session_users: [] },
    '11:00': { hour: 11, minute: 0, session_users: [] },
    '11:15': { hour: 11, minute: 15, session_users: [] },
    '11:30': { hour: 11, minute: 30, session_users: [] },
    '11:45': { hour: 11, minute: 45, session_users: [] },
    '12:00': { hour: 12, minute: 0, session_users: [] },
    '12:15': { hour: 12, minute: 15, session_users: [] },
    '12:30': { hour: 12, minute: 30, session_users: [] },
    '12:45': { hour: 12, minute: 45, session_users: [] },
    '13:00': { hour: 13, minute: 0, session_users: [] },
    '13:15': { hour: 13, minute: 15, session_users: [] },
    '13:30': { hour: 13, minute: 30, session_users: [] },
    '13:45': { hour: 13, minute: 45, session_users: [] },
    '14:00': { hour: 14, minute: 0, session_users: [] },
    '14:15': { hour: 14, minute: 15, session_users: [] },
    '14:30': { hour: 14, minute: 30, session_users: [] },
    '14:45': { hour: 14, minute: 45, session_users: [] },
    '15:00': { hour: 15, minute: 0, session_users: [] },
    '15:15': { hour: 15, minute: 15, session_users: [] },
    '15:30': { hour: 15, minute: 30, session_users: [] },
    '15:45': { hour: 15, minute: 45, session_users: [] },
    '16:00': { hour: 16, minute: 0, session_users: [] },
    '16:15': { hour: 16, minute: 15, session_users: [] },
    '16:30': { hour: 16, minute: 30, session_users: [] },
    '16:45': { hour: 16, minute: 45, session_users: [] },
    '17:00': { hour: 17, minute: 0, session_users: [] },
    '17:15': { hour: 17, minute: 15, session_users: [] },
    '17:30': { hour: 17, minute: 30, session_users: [] },
    '17:45': { hour: 17, minute: 45, session_users: [] },
    '18:00': { hour: 18, minute: 0, session_users: [] },
    '18:15': { hour: 18, minute: 15, session_users: [] },
    '18:30': { hour: 18, minute: 30, session_users: [] },
    '18:45': { hour: 18, minute: 45, session_users: [] },
    '19:00': { hour: 19, minute: 0, session_users: [] },
    '19:15': { hour: 19, minute: 15, session_users: [] },
    '19:30': { hour: 19, minute: 30, session_users: [] },
    '19:45': { hour: 19, minute: 45, session_users: [] },
    '20:00': { hour: 20, minute: 0, session_users: [] },
    '20:15': { hour: 20, minute: 15, session_users: [] },
    '20:30': { hour: 20, minute: 30, session_users: [] },
    '20:45': { hour: 20, minute: 45, session_users: [] },
    '21:00': { hour: 21, minute: 0, session_users: [] },
    '21:15': { hour: 21, minute: 15, session_users: [] },
    '21:30': { hour: 21, minute: 30, session_users: [] },
    '21:45': { hour: 21, minute: 45, session_users: [] },
    '22:00': { hour: 22, minute: 0, session_users: [] },
    '22:15': { hour: 22, minute: 15, session_users: [] },
    '22:30': { hour: 22, minute: 30, session_users: [] },
    '22:45': { hour: 22, minute: 45, session_users: [] },
    '23:00': { hour: 23, minute: 0, session_users: [] },
    '23:15': { hour: 23, minute: 15, session_users: [] },
    '23:30': { hour: 23, minute: 30, session_users: [] },
    '23:45': { hour: 23, minute: 45, session_users: [] }
  },
  TUE: {
    '00:00': { hour: 0, minute: 0, session_users: [] },
    '00:15': { hour: 0, minute: 15, session_users: [] },
    '00:30': { hour: 0, minute: 30, session_users: [] },
    '00:45': { hour: 0, minute: 45, session_users: [] },
    '01:00': { hour: 1, minute: 0, session_users: [] },
    '01:15': { hour: 1, minute: 15, session_users: [] },
    '01:30': { hour: 1, minute: 30, session_users: [] },
    '01:45': { hour: 1, minute: 45, session_users: [] },
    '02:00': { hour: 2, minute: 0, session_users: [] },
    '02:15': { hour: 2, minute: 15, session_users: [] },
    '02:30': { hour: 2, minute: 30, session_users: [] },
    '02:45': { hour: 2, minute: 45, session_users: [] },
    '03:00': { hour: 3, minute: 0, session_users: [] },
    '03:15': { hour: 3, minute: 15, session_users: [] },
    '03:30': { hour: 3, minute: 30, session_users: [] },
    '03:45': { hour: 3, minute: 45, session_users: [] },
    '04:00': { hour: 4, minute: 0, session_users: [] },
    '04:15': { hour: 4, minute: 15, session_users: [] },
    '04:30': { hour: 4, minute: 30, session_users: [] },
    '04:45': { hour: 4, minute: 45, session_users: [] },
    '05:00': { hour: 5, minute: 0, session_users: [] },
    '05:15': { hour: 5, minute: 15, session_users: [] },
    '05:30': { hour: 5, minute: 30, session_users: [] },
    '05:45': { hour: 5, minute: 45, session_users: [] },
    '06:00': { hour: 6, minute: 0, session_users: [] },
    '06:15': { hour: 6, minute: 15, session_users: [] },
    '06:30': { hour: 6, minute: 30, session_users: [] },
    '06:45': { hour: 6, minute: 45, session_users: [] },
    '07:00': { hour: 7, minute: 0, session_users: [] },
    '07:15': { hour: 7, minute: 15, session_users: [] },
    '07:30': { hour: 7, minute: 30, session_users: [] },
    '07:45': { hour: 7, minute: 45, session_users: [] },
    '08:00': { hour: 8, minute: 0, session_users: [] },
    '08:15': { hour: 8, minute: 15, session_users: [] },
    '08:30': { hour: 8, minute: 30, session_users: [] },
    '08:45': { hour: 8, minute: 45, session_users: [] },
    '09:00': { hour: 9, minute: 0, session_users: [] },
    '09:15': { hour: 9, minute: 15, session_users: [] },
    '09:30': { hour: 9, minute: 30, session_users: [] },
    '09:45': { hour: 9, minute: 45, session_users: [] },
    '10:00': { hour: 10, minute: 0, session_users: [] },
    '10:15': { hour: 10, minute: 15, session_users: [] },
    '10:30': { hour: 10, minute: 30, session_users: [] },
    '10:45': { hour: 10, minute: 45, session_users: [] },
    '11:00': { hour: 11, minute: 0, session_users: [] },
    '11:15': { hour: 11, minute: 15, session_users: [] },
    '11:30': { hour: 11, minute: 30, session_users: [] },
    '11:45': { hour: 11, minute: 45, session_users: [] },
    '12:00': { hour: 12, minute: 0, session_users: [] },
    '12:15': { hour: 12, minute: 15, session_users: [] },
    '12:30': { hour: 12, minute: 30, session_users: [] },
    '12:45': { hour: 12, minute: 45, session_users: [] },
    '13:00': { hour: 13, minute: 0, session_users: [] },
    '13:15': { hour: 13, minute: 15, session_users: [] },
    '13:30': { hour: 13, minute: 30, session_users: [] },
    '13:45': { hour: 13, minute: 45, session_users: [] },
    '14:00': { hour: 14, minute: 0, session_users: [] },
    '14:15': { hour: 14, minute: 15, session_users: [] },
    '14:30': { hour: 14, minute: 30, session_users: [] },
    '14:45': { hour: 14, minute: 45, session_users: [] },
    '15:00': { hour: 15, minute: 0, session_users: [] },
    '15:15': { hour: 15, minute: 15, session_users: [] },
    '15:30': { hour: 15, minute: 30, session_users: [] },
    '15:45': { hour: 15, minute: 45, session_users: [] },
    '16:00': { hour: 16, minute: 0, session_users: [] },
    '16:15': { hour: 16, minute: 15, session_users: [] },
    '16:30': { hour: 16, minute: 30, session_users: [] },
    '16:45': { hour: 16, minute: 45, session_users: [] },
    '17:00': { hour: 17, minute: 0, session_users: [] },
    '17:15': { hour: 17, minute: 15, session_users: [] },
    '17:30': { hour: 17, minute: 30, session_users: [] },
    '17:45': { hour: 17, minute: 45, session_users: [] },
    '18:00': { hour: 18, minute: 0, session_users: [] },
    '18:15': { hour: 18, minute: 15, session_users: [] },
    '18:30': { hour: 18, minute: 30, session_users: [] },
    '18:45': { hour: 18, minute: 45, session_users: [] },
    '19:00': { hour: 19, minute: 0, session_users: [] },
    '19:15': { hour: 19, minute: 15, session_users: [] },
    '19:30': { hour: 19, minute: 30, session_users: [] },
    '19:45': { hour: 19, minute: 45, session_users: [] },
    '20:00': { hour: 20, minute: 0, session_users: [] },
    '20:15': { hour: 20, minute: 15, session_users: [] },
    '20:30': { hour: 20, minute: 30, session_users: [] },
    '20:45': { hour: 20, minute: 45, session_users: [] },
    '21:00': { hour: 21, minute: 0, session_users: [] },
    '21:15': { hour: 21, minute: 15, session_users: [] },
    '21:30': { hour: 21, minute: 30, session_users: [] },
    '21:45': { hour: 21, minute: 45, session_users: [] },
    '22:00': { hour: 22, minute: 0, session_users: [] },
    '22:15': { hour: 22, minute: 15, session_users: [] },
    '22:30': { hour: 22, minute: 30, session_users: [] },
    '22:45': { hour: 22, minute: 45, session_users: [] },
    '23:00': { hour: 23, minute: 0, session_users: [] },
    '23:15': { hour: 23, minute: 15, session_users: [] },
    '23:30': { hour: 23, minute: 30, session_users: [] },
    '23:45': { hour: 23, minute: 45, session_users: [] }
  },
  WED: {
    '00:00': { hour: 0, minute: 0, session_users: [] },
    '00:15': { hour: 0, minute: 15, session_users: [] },
    '00:30': { hour: 0, minute: 30, session_users: [] },
    '00:45': { hour: 0, minute: 45, session_users: [] },
    '01:00': { hour: 1, minute: 0, session_users: [] },
    '01:15': { hour: 1, minute: 15, session_users: [] },
    '01:30': { hour: 1, minute: 30, session_users: [] },
    '01:45': { hour: 1, minute: 45, session_users: [] },
    '02:00': { hour: 2, minute: 0, session_users: [] },
    '02:15': { hour: 2, minute: 15, session_users: [] },
    '02:30': { hour: 2, minute: 30, session_users: [] },
    '02:45': { hour: 2, minute: 45, session_users: [] },
    '03:00': { hour: 3, minute: 0, session_users: [] },
    '03:15': { hour: 3, minute: 15, session_users: [] },
    '03:30': { hour: 3, minute: 30, session_users: [] },
    '03:45': { hour: 3, minute: 45, session_users: [] },
    '04:00': { hour: 4, minute: 0, session_users: [] },
    '04:15': { hour: 4, minute: 15, session_users: [] },
    '04:30': { hour: 4, minute: 30, session_users: [] },
    '04:45': { hour: 4, minute: 45, session_users: [] },
    '05:00': { hour: 5, minute: 0, session_users: [] },
    '05:15': { hour: 5, minute: 15, session_users: [] },
    '05:30': { hour: 5, minute: 30, session_users: [] },
    '05:45': { hour: 5, minute: 45, session_users: [] },
    '06:00': { hour: 6, minute: 0, session_users: [] },
    '06:15': { hour: 6, minute: 15, session_users: [] },
    '06:30': { hour: 6, minute: 30, session_users: [] },
    '06:45': { hour: 6, minute: 45, session_users: [] },
    '07:00': { hour: 7, minute: 0, session_users: [] },
    '07:15': { hour: 7, minute: 15, session_users: [] },
    '07:30': { hour: 7, minute: 30, session_users: [] },
    '07:45': { hour: 7, minute: 45, session_users: [] },
    '08:00': { hour: 8, minute: 0, session_users: [] },
    '08:15': { hour: 8, minute: 15, session_users: [] },
    '08:30': { hour: 8, minute: 30, session_users: [] },
    '08:45': { hour: 8, minute: 45, session_users: [] },
    '09:00': { hour: 9, minute: 0, session_users: [] },
    '09:15': { hour: 9, minute: 15, session_users: [] },
    '09:30': { hour: 9, minute: 30, session_users: [] },
    '09:45': { hour: 9, minute: 45, session_users: [] },
    '10:00': { hour: 10, minute: 0, session_users: [] },
    '10:15': { hour: 10, minute: 15, session_users: [] },
    '10:30': { hour: 10, minute: 30, session_users: [] },
    '10:45': { hour: 10, minute: 45, session_users: [] },
    '11:00': { hour: 11, minute: 0, session_users: [] },
    '11:15': { hour: 11, minute: 15, session_users: [] },
    '11:30': { hour: 11, minute: 30, session_users: [] },
    '11:45': { hour: 11, minute: 45, session_users: [] },
    '12:00': { hour: 12, minute: 0, session_users: [] },
    '12:15': { hour: 12, minute: 15, session_users: [] },
    '12:30': { hour: 12, minute: 30, session_users: [] },
    '12:45': { hour: 12, minute: 45, session_users: [] },
    '13:00': { hour: 13, minute: 0, session_users: [] },
    '13:15': { hour: 13, minute: 15, session_users: [] },
    '13:30': { hour: 13, minute: 30, session_users: [] },
    '13:45': { hour: 13, minute: 45, session_users: [] },
    '14:00': { hour: 14, minute: 0, session_users: [] },
    '14:15': { hour: 14, minute: 15, session_users: [] },
    '14:30': { hour: 14, minute: 30, session_users: [] },
    '14:45': { hour: 14, minute: 45, session_users: [] },
    '15:00': { hour: 15, minute: 0, session_users: [] },
    '15:15': { hour: 15, minute: 15, session_users: [] },
    '15:30': { hour: 15, minute: 30, session_users: [] },
    '15:45': { hour: 15, minute: 45, session_users: [] },
    '16:00': { hour: 16, minute: 0, session_users: [] },
    '16:15': { hour: 16, minute: 15, session_users: [] },
    '16:30': { hour: 16, minute: 30, session_users: [] },
    '16:45': { hour: 16, minute: 45, session_users: [] },
    '17:00': { hour: 17, minute: 0, session_users: [] },
    '17:15': { hour: 17, minute: 15, session_users: [] },
    '17:30': { hour: 17, minute: 30, session_users: [] },
    '17:45': { hour: 17, minute: 45, session_users: [] },
    '18:00': { hour: 18, minute: 0, session_users: [] },
    '18:15': { hour: 18, minute: 15, session_users: [] },
    '18:30': { hour: 18, minute: 30, session_users: [] },
    '18:45': { hour: 18, minute: 45, session_users: [] },
    '19:00': { hour: 19, minute: 0, session_users: [] },
    '19:15': { hour: 19, minute: 15, session_users: [] },
    '19:30': { hour: 19, minute: 30, session_users: [] },
    '19:45': { hour: 19, minute: 45, session_users: [] },
    '20:00': { hour: 20, minute: 0, session_users: [] },
    '20:15': { hour: 20, minute: 15, session_users: [] },
    '20:30': { hour: 20, minute: 30, session_users: [] },
    '20:45': { hour: 20, minute: 45, session_users: [] },
    '21:00': { hour: 21, minute: 0, session_users: [] },
    '21:15': { hour: 21, minute: 15, session_users: [] },
    '21:30': { hour: 21, minute: 30, session_users: [] },
    '21:45': { hour: 21, minute: 45, session_users: [] },
    '22:00': { hour: 22, minute: 0, session_users: [] },
    '22:15': { hour: 22, minute: 15, session_users: [] },
    '22:30': { hour: 22, minute: 30, session_users: [] },
    '22:45': { hour: 22, minute: 45, session_users: [] },
    '23:00': { hour: 23, minute: 0, session_users: [] },
    '23:15': { hour: 23, minute: 15, session_users: [] },
    '23:30': { hour: 23, minute: 30, session_users: [] },
    '23:45': { hour: 23, minute: 45, session_users: [] }
  },
  THU: {
    '00:00': { hour: 0, minute: 0, session_users: [] },
    '00:15': { hour: 0, minute: 15, session_users: [] },
    '00:30': { hour: 0, minute: 30, session_users: [] },
    '00:45': { hour: 0, minute: 45, session_users: [] },
    '01:00': { hour: 1, minute: 0, session_users: [] },
    '01:15': { hour: 1, minute: 15, session_users: [] },
    '01:30': { hour: 1, minute: 30, session_users: [] },
    '01:45': { hour: 1, minute: 45, session_users: [] },
    '02:00': { hour: 2, minute: 0, session_users: [] },
    '02:15': { hour: 2, minute: 15, session_users: [] },
    '02:30': { hour: 2, minute: 30, session_users: [] },
    '02:45': { hour: 2, minute: 45, session_users: [] },
    '03:00': { hour: 3, minute: 0, session_users: [] },
    '03:15': { hour: 3, minute: 15, session_users: [] },
    '03:30': { hour: 3, minute: 30, session_users: [] },
    '03:45': { hour: 3, minute: 45, session_users: [] },
    '04:00': { hour: 4, minute: 0, session_users: [] },
    '04:15': { hour: 4, minute: 15, session_users: [] },
    '04:30': { hour: 4, minute: 30, session_users: [] },
    '04:45': { hour: 4, minute: 45, session_users: [] },
    '05:00': { hour: 5, minute: 0, session_users: [] },
    '05:15': { hour: 5, minute: 15, session_users: [] },
    '05:30': { hour: 5, minute: 30, session_users: [] },
    '05:45': { hour: 5, minute: 45, session_users: [] },
    '06:00': { hour: 6, minute: 0, session_users: [] },
    '06:15': { hour: 6, minute: 15, session_users: [] },
    '06:30': { hour: 6, minute: 30, session_users: [] },
    '06:45': { hour: 6, minute: 45, session_users: [] },
    '07:00': { hour: 7, minute: 0, session_users: [] },
    '07:15': { hour: 7, minute: 15, session_users: [] },
    '07:30': { hour: 7, minute: 30, session_users: [] },
    '07:45': { hour: 7, minute: 45, session_users: [] },
    '08:00': { hour: 8, minute: 0, session_users: [] },
    '08:15': { hour: 8, minute: 15, session_users: [] },
    '08:30': { hour: 8, minute: 30, session_users: [] },
    '08:45': { hour: 8, minute: 45, session_users: [] },
    '09:00': { hour: 9, minute: 0, session_users: [] },
    '09:15': { hour: 9, minute: 15, session_users: [] },
    '09:30': { hour: 9, minute: 30, session_users: [] },
    '09:45': { hour: 9, minute: 45, session_users: [] },
    '10:00': { hour: 10, minute: 0, session_users: [] },
    '10:15': { hour: 10, minute: 15, session_users: [] },
    '10:30': { hour: 10, minute: 30, session_users: [] },
    '10:45': { hour: 10, minute: 45, session_users: [] },
    '11:00': { hour: 11, minute: 0, session_users: [] },
    '11:15': { hour: 11, minute: 15, session_users: [] },
    '11:30': { hour: 11, minute: 30, session_users: [] },
    '11:45': { hour: 11, minute: 45, session_users: [] },
    '12:00': { hour: 12, minute: 0, session_users: [] },
    '12:15': { hour: 12, minute: 15, session_users: [] },
    '12:30': { hour: 12, minute: 30, session_users: [] },
    '12:45': { hour: 12, minute: 45, session_users: [] },
    '13:00': { hour: 13, minute: 0, session_users: [] },
    '13:15': { hour: 13, minute: 15, session_users: [] },
    '13:30': { hour: 13, minute: 30, session_users: [] },
    '13:45': { hour: 13, minute: 45, session_users: [] },
    '14:00': { hour: 14, minute: 0, session_users: [] },
    '14:15': { hour: 14, minute: 15, session_users: [] },
    '14:30': { hour: 14, minute: 30, session_users: [] },
    '14:45': { hour: 14, minute: 45, session_users: [] },
    '15:00': { hour: 15, minute: 0, session_users: [] },
    '15:15': { hour: 15, minute: 15, session_users: [] },
    '15:30': { hour: 15, minute: 30, session_users: [] },
    '15:45': { hour: 15, minute: 45, session_users: [] },
    '16:00': { hour: 16, minute: 0, session_users: [] },
    '16:15': { hour: 16, minute: 15, session_users: [] },
    '16:30': { hour: 16, minute: 30, session_users: [] },
    '16:45': { hour: 16, minute: 45, session_users: [] },
    '17:00': { hour: 17, minute: 0, session_users: [] },
    '17:15': { hour: 17, minute: 15, session_users: [] },
    '17:30': { hour: 17, minute: 30, session_users: [] },
    '17:45': { hour: 17, minute: 45, session_users: [] },
    '18:00': { hour: 18, minute: 0, session_users: [] },
    '18:15': { hour: 18, minute: 15, session_users: [] },
    '18:30': { hour: 18, minute: 30, session_users: [] },
    '18:45': { hour: 18, minute: 45, session_users: [] },
    '19:00': { hour: 19, minute: 0, session_users: [] },
    '19:15': { hour: 19, minute: 15, session_users: [] },
    '19:30': { hour: 19, minute: 30, session_users: [] },
    '19:45': { hour: 19, minute: 45, session_users: [] },
    '20:00': { hour: 20, minute: 0, session_users: [] },
    '20:15': { hour: 20, minute: 15, session_users: [] },
    '20:30': { hour: 20, minute: 30, session_users: [] },
    '20:45': { hour: 20, minute: 45, session_users: [] },
    '21:00': { hour: 21, minute: 0, session_users: [] },
    '21:15': { hour: 21, minute: 15, session_users: [] },
    '21:30': { hour: 21, minute: 30, session_users: [] },
    '21:45': { hour: 21, minute: 45, session_users: [] },
    '22:00': { hour: 22, minute: 0, session_users: [] },
    '22:15': { hour: 22, minute: 15, session_users: [] },
    '22:30': { hour: 22, minute: 30, session_users: [] },
    '22:45': { hour: 22, minute: 45, session_users: [] },
    '23:00': { hour: 23, minute: 0, session_users: [] },
    '23:15': { hour: 23, minute: 15, session_users: [] },
    '23:30': { hour: 23, minute: 30, session_users: [] },
    '23:45': { hour: 23, minute: 45, session_users: [] }
  },
  FRI: {
    '00:00': { hour: 0, minute: 0, session_users: [] },
    '00:15': { hour: 0, minute: 15, session_users: [] },
    '00:30': { hour: 0, minute: 30, session_users: [] },
    '00:45': { hour: 0, minute: 45, session_users: [] },
    '01:00': { hour: 1, minute: 0, session_users: [] },
    '01:15': { hour: 1, minute: 15, session_users: [] },
    '01:30': { hour: 1, minute: 30, session_users: [] },
    '01:45': { hour: 1, minute: 45, session_users: [] },
    '02:00': { hour: 2, minute: 0, session_users: [] },
    '02:15': { hour: 2, minute: 15, session_users: [] },
    '02:30': { hour: 2, minute: 30, session_users: [] },
    '02:45': { hour: 2, minute: 45, session_users: [] },
    '03:00': { hour: 3, minute: 0, session_users: [] },
    '03:15': { hour: 3, minute: 15, session_users: [] },
    '03:30': { hour: 3, minute: 30, session_users: [] },
    '03:45': { hour: 3, minute: 45, session_users: [] },
    '04:00': { hour: 4, minute: 0, session_users: [] },
    '04:15': { hour: 4, minute: 15, session_users: [] },
    '04:30': { hour: 4, minute: 30, session_users: [] },
    '04:45': { hour: 4, minute: 45, session_users: [] },
    '05:00': { hour: 5, minute: 0, session_users: [] },
    '05:15': { hour: 5, minute: 15, session_users: [] },
    '05:30': { hour: 5, minute: 30, session_users: [] },
    '05:45': { hour: 5, minute: 45, session_users: [] },
    '06:00': { hour: 6, minute: 0, session_users: [] },
    '06:15': { hour: 6, minute: 15, session_users: [] },
    '06:30': { hour: 6, minute: 30, session_users: [] },
    '06:45': { hour: 6, minute: 45, session_users: [] },
    '07:00': { hour: 7, minute: 0, session_users: [] },
    '07:15': { hour: 7, minute: 15, session_users: [] },
    '07:30': { hour: 7, minute: 30, session_users: [] },
    '07:45': { hour: 7, minute: 45, session_users: [] },
    '08:00': { hour: 8, minute: 0, session_users: [] },
    '08:15': { hour: 8, minute: 15, session_users: [] },
    '08:30': { hour: 8, minute: 30, session_users: [] },
    '08:45': { hour: 8, minute: 45, session_users: [] },
    '09:00': { hour: 9, minute: 0, session_users: [] },
    '09:15': { hour: 9, minute: 15, session_users: [] },
    '09:30': { hour: 9, minute: 30, session_users: [] },
    '09:45': { hour: 9, minute: 45, session_users: [] },
    '10:00': { hour: 10, minute: 0, session_users: [] },
    '10:15': { hour: 10, minute: 15, session_users: [] },
    '10:30': { hour: 10, minute: 30, session_users: [] },
    '10:45': { hour: 10, minute: 45, session_users: [] },
    '11:00': { hour: 11, minute: 0, session_users: [] },
    '11:15': { hour: 11, minute: 15, session_users: [] },
    '11:30': { hour: 11, minute: 30, session_users: [] },
    '11:45': { hour: 11, minute: 45, session_users: [] },
    '12:00': { hour: 12, minute: 0, session_users: [] },
    '12:15': { hour: 12, minute: 15, session_users: [] },
    '12:30': { hour: 12, minute: 30, session_users: [] },
    '12:45': { hour: 12, minute: 45, session_users: [] },
    '13:00': { hour: 13, minute: 0, session_users: [] },
    '13:15': { hour: 13, minute: 15, session_users: [] },
    '13:30': { hour: 13, minute: 30, session_users: [] },
    '13:45': { hour: 13, minute: 45, session_users: [] },
    '14:00': { hour: 14, minute: 0, session_users: [] },
    '14:15': { hour: 14, minute: 15, session_users: [] },
    '14:30': { hour: 14, minute: 30, session_users: [] },
    '14:45': { hour: 14, minute: 45, session_users: [] },
    '15:00': { hour: 15, minute: 0, session_users: [] },
    '15:15': { hour: 15, minute: 15, session_users: [] },
    '15:30': { hour: 15, minute: 30, session_users: [] },
    '15:45': { hour: 15, minute: 45, session_users: [] },
    '16:00': { hour: 16, minute: 0, session_users: [] },
    '16:15': { hour: 16, minute: 15, session_users: [] },
    '16:30': { hour: 16, minute: 30, session_users: [] },
    '16:45': { hour: 16, minute: 45, session_users: [] },
    '17:00': { hour: 17, minute: 0, session_users: [] },
    '17:15': { hour: 17, minute: 15, session_users: [] },
    '17:30': { hour: 17, minute: 30, session_users: [] },
    '17:45': { hour: 17, minute: 45, session_users: [] },
    '18:00': { hour: 18, minute: 0, session_users: [] },
    '18:15': { hour: 18, minute: 15, session_users: [] },
    '18:30': { hour: 18, minute: 30, session_users: [] },
    '18:45': { hour: 18, minute: 45, session_users: [] },
    '19:00': { hour: 19, minute: 0, session_users: [] },
    '19:15': { hour: 19, minute: 15, session_users: [] },
    '19:30': { hour: 19, minute: 30, session_users: [] },
    '19:45': { hour: 19, minute: 45, session_users: [] },
    '20:00': { hour: 20, minute: 0, session_users: [] },
    '20:15': { hour: 20, minute: 15, session_users: [] },
    '20:30': { hour: 20, minute: 30, session_users: [] },
    '20:45': { hour: 20, minute: 45, session_users: [] },
    '21:00': { hour: 21, minute: 0, session_users: [] },
    '21:15': { hour: 21, minute: 15, session_users: [] },
    '21:30': { hour: 21, minute: 30, session_users: [] },
    '21:45': { hour: 21, minute: 45, session_users: [] },
    '22:00': { hour: 22, minute: 0, session_users: [] },
    '22:15': { hour: 22, minute: 15, session_users: [] },
    '22:30': { hour: 22, minute: 30, session_users: [] },
    '22:45': { hour: 22, minute: 45, session_users: [] },
    '23:00': { hour: 23, minute: 0, session_users: [] },
    '23:15': { hour: 23, minute: 15, session_users: [] },
    '23:30': { hour: 23, minute: 30, session_users: [] },
    '23:45': { hour: 23, minute: 45, session_users: [] }
  },
  SAT: {
    '00:00': { hour: 0, minute: 0, session_users: [] },
    '00:15': { hour: 0, minute: 15, session_users: [] },
    '00:30': { hour: 0, minute: 30, session_users: [] },
    '00:45': { hour: 0, minute: 45, session_users: [] },
    '01:00': { hour: 1, minute: 0, session_users: [] },
    '01:15': { hour: 1, minute: 15, session_users: [] },
    '01:30': { hour: 1, minute: 30, session_users: [] },
    '01:45': { hour: 1, minute: 45, session_users: [] },
    '02:00': { hour: 2, minute: 0, session_users: [] },
    '02:15': { hour: 2, minute: 15, session_users: [] },
    '02:30': { hour: 2, minute: 30, session_users: [] },
    '02:45': { hour: 2, minute: 45, session_users: [] },
    '03:00': { hour: 3, minute: 0, session_users: [] },
    '03:15': { hour: 3, minute: 15, session_users: [] },
    '03:30': { hour: 3, minute: 30, session_users: [] },
    '03:45': { hour: 3, minute: 45, session_users: [] },
    '04:00': { hour: 4, minute: 0, session_users: [] },
    '04:15': { hour: 4, minute: 15, session_users: [] },
    '04:30': { hour: 4, minute: 30, session_users: [] },
    '04:45': { hour: 4, minute: 45, session_users: [] },
    '05:00': { hour: 5, minute: 0, session_users: [] },
    '05:15': { hour: 5, minute: 15, session_users: [] },
    '05:30': { hour: 5, minute: 30, session_users: [] },
    '05:45': { hour: 5, minute: 45, session_users: [] },
    '06:00': { hour: 6, minute: 0, session_users: [] },
    '06:15': { hour: 6, minute: 15, session_users: [] },
    '06:30': { hour: 6, minute: 30, session_users: [] },
    '06:45': { hour: 6, minute: 45, session_users: [] },
    '07:00': { hour: 7, minute: 0, session_users: [] },
    '07:15': { hour: 7, minute: 15, session_users: [] },
    '07:30': { hour: 7, minute: 30, session_users: [] },
    '07:45': { hour: 7, minute: 45, session_users: [] },
    '08:00': { hour: 8, minute: 0, session_users: [] },
    '08:15': { hour: 8, minute: 15, session_users: [] },
    '08:30': { hour: 8, minute: 30, session_users: [] },
    '08:45': { hour: 8, minute: 45, session_users: [] },
    '09:00': { hour: 9, minute: 0, session_users: [] },
    '09:15': { hour: 9, minute: 15, session_users: [] },
    '09:30': { hour: 9, minute: 30, session_users: [] },
    '09:45': { hour: 9, minute: 45, session_users: [] },
    '10:00': { hour: 10, minute: 0, session_users: [] },
    '10:15': { hour: 10, minute: 15, session_users: [] },
    '10:30': { hour: 10, minute: 30, session_users: [] },
    '10:45': { hour: 10, minute: 45, session_users: [] },
    '11:00': { hour: 11, minute: 0, session_users: [] },
    '11:15': { hour: 11, minute: 15, session_users: [] },
    '11:30': { hour: 11, minute: 30, session_users: [] },
    '11:45': { hour: 11, minute: 45, session_users: [] },
    '12:00': { hour: 12, minute: 0, session_users: [] },
    '12:15': { hour: 12, minute: 15, session_users: [] },
    '12:30': { hour: 12, minute: 30, session_users: [] },
    '12:45': { hour: 12, minute: 45, session_users: [] },
    '13:00': { hour: 13, minute: 0, session_users: [] },
    '13:15': { hour: 13, minute: 15, session_users: [] },
    '13:30': { hour: 13, minute: 30, session_users: [] },
    '13:45': { hour: 13, minute: 45, session_users: [] },
    '14:00': { hour: 14, minute: 0, session_users: [] },
    '14:15': { hour: 14, minute: 15, session_users: [] },
    '14:30': { hour: 14, minute: 30, session_users: [] },
    '14:45': { hour: 14, minute: 45, session_users: [] },
    '15:00': { hour: 15, minute: 0, session_users: [] },
    '15:15': { hour: 15, minute: 15, session_users: [] },
    '15:30': { hour: 15, minute: 30, session_users: [] },
    '15:45': { hour: 15, minute: 45, session_users: [] },
    '16:00': { hour: 16, minute: 0, session_users: [] },
    '16:15': { hour: 16, minute: 15, session_users: [] },
    '16:30': { hour: 16, minute: 30, session_users: [] },
    '16:45': { hour: 16, minute: 45, session_users: [] },
    '17:00': { hour: 17, minute: 0, session_users: [] },
    '17:15': { hour: 17, minute: 15, session_users: [] },
    '17:30': { hour: 17, minute: 30, session_users: [] },
    '17:45': { hour: 17, minute: 45, session_users: [] },
    '18:00': { hour: 18, minute: 0, session_users: [] },
    '18:15': { hour: 18, minute: 15, session_users: [] },
    '18:30': { hour: 18, minute: 30, session_users: [] },
    '18:45': { hour: 18, minute: 45, session_users: [] },
    '19:00': { hour: 19, minute: 0, session_users: [] },
    '19:15': { hour: 19, minute: 15, session_users: [] },
    '19:30': { hour: 19, minute: 30, session_users: [] },
    '19:45': { hour: 19, minute: 45, session_users: [] },
    '20:00': { hour: 20, minute: 0, session_users: [] },
    '20:15': { hour: 20, minute: 15, session_users: [] },
    '20:30': { hour: 20, minute: 30, session_users: [] },
    '20:45': { hour: 20, minute: 45, session_users: [] },
    '21:00': { hour: 21, minute: 0, session_users: [] },
    '21:15': { hour: 21, minute: 15, session_users: [] },
    '21:30': { hour: 21, minute: 30, session_users: [] },
    '21:45': { hour: 21, minute: 45, session_users: [] },
    '22:00': { hour: 22, minute: 0, session_users: [] },
    '22:15': { hour: 22, minute: 15, session_users: [] },
    '22:30': { hour: 22, minute: 30, session_users: [] },
    '22:45': { hour: 22, minute: 45, session_users: [] },
    '23:00': { hour: 23, minute: 0, session_users: [] },
    '23:15': { hour: 23, minute: 15, session_users: [] },
    '23:30': { hour: 23, minute: 30, session_users: [] },
    '23:45': { hour: 23, minute: 45, session_users: [] }
  }
}

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