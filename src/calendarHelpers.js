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
      emptyAppointments[day][timeString] = { 'state': 'empty' };
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
        'owner_name': appointment.owner_first_name,
        'owner_pic': appointment.owner_profile_image_url,
        'owner_ref_id': appointment.owner_ref_id,
        'day': dayOfWeek,
        'start_time': startTimeUserTZ,
        'activity_type': appointment.activity_type
      });

    } else {
      reconstructedAppointments[dayOfWeek][startTimeString] = {
          'id': appointment.id,
          'owner_name': appointment.owner_first_name,
          'owner_pic': appointment.owner_profile_image_url,
          'owner_ref_id': appointment.owner_ref_id,
          'day': dayOfWeek,
          'start_time': startTimeUserTZ,
          'activity_type': appointment.activity_type
      };
    }
  }

  // reassign timeslots where there are conflicts
  for (const day in sameSlotAppointments) {
    // console.log(sameSlotAppointments[day]);
    for (const timeslot in sameSlotAppointments[day]) {
      // assign an appointment through the matchmaker
      reconstructedAppointments[day][timeslot] = matchMake(sameSlotAppointments[day][timeslot]);
    }
  }

  console.log(reconstructedAppointments['WED']['00:00']);
  // console.log(sameSlotAppointments);
  return reconstructedAppointments;
}


// replace with static var after finalizing formats
const allSlots = autoGenerateEmptyAppointments();

// // examples
// let today = new Date();
// console.log(extractDayOfWeek(today.toString()));
// console.log(extractTimeString("2021-03-29T01:07:04.353Z"));
// console.log(changeToUserTZ(today.toString(), 'Asia/Singapore'));
// console.log(getWeekDates("2021-03-29T19:07:04.353Z"));

const fakeSessions = [
  // 3 appointments on the same timeslot
  {
    id: 1,
    owner_first_name: 'Chuck',
    owner_profile_image_url: 'avatar',
    owner_ref_id: 'd93ghjfek',
    start_time: '2021-03-15T16:00:00.000Z',
    activity_type: 'napping'
  },
  {
    id: 2,
    owner_first_name: 'Rick',
    owner_profile_image_url: 'avatar',
    owner_ref_id: 'dsa98f89b',
    start_time: '2021-03-15T16:00:00.000Z',
    activity_type: 'lounging'
  },
  {
    id: 3,
    owner_first_name: 'Morty',
    owner_profile_image_url: 'avatar',
    owner_ref_id: 'fd938hgds',
    start_time: '2021-03-15T16:00:00.000Z',
    activity_type: 'sleeping'
  },
  // 1 appointment with no dups
  {
    id: 4,
    owner_first_name: 'Coolguy',
    owner_profile_image_url: 'avatar',
    owner_ref_id: 'fdsegfgr0a',
    start_time: '2021-03-15T16:30:00.000Z',
    activity_type: 'sleeping'
  },
  // 2 more dup appointments
  {
    id: 5,
    owner_first_name: 'Dup1',
    owner_profile_image_url: 'avatar',
    owner_ref_id: 'hjy5eje5',
    start_time: '2021-03-15T17:30:00.000Z',
    activity_type: 'sleeping'
  },
  {
    id: 6,
    owner_first_name: 'Dup2',
    owner_profile_image_url: 'avatar',
    owner_ref_id: 'gvrf43hj6',
    start_time: '2021-03-15T17:30:00.000Z',
    activity_type: 'sleeping'
  },
];

rebuildAppointmentObjs(allSlots, fakeSessions, 'Asia/Singapore');


module.exports = {
  allSlots,
  extractTimeString,
  extractDayOfWeek,
  changeToUserTZ,
  getWeekDates
}

/* example allSlots
const allSlots = {
  MON: {
    '00:00': { state: 'empty' },
    '00:15': { state: 'empty' },
    '00:30': { state: 'empty' },
    '00:45': { state: 'empty' },
    '01:00': { state: 'empty' },
    '01:15': { state: 'empty' },
    '01:30': { state: 'empty' },
    '01:45': { state: 'empty' },
    '02:00': { state: 'empty' },
    '02:15': { state: 'empty' },
    '02:30': { state: 'empty' },
    '02:45': { state: 'empty' },
    '03:00': { state: 'empty' },
    '03:15': { state: 'empty' },
    '03:30': { state: 'empty' },
    '03:45': { state: 'empty' },
    '04:00': { state: 'empty' },
    '04:15': { state: 'empty' },
    '04:30': { state: 'empty' },
    '04:45': { state: 'empty' },
    '05:00': { state: 'empty' },
    '05:15': { state: 'empty' },
    '05:30': { state: 'empty' },
    '05:45': { state: 'empty' },
    '06:00': { state: 'empty' },
    '06:15': { state: 'empty' },
    '06:30': { state: 'empty' },
    '06:45': { state: 'empty' },
    '07:00': { state: 'empty' },
    '07:15': { state: 'empty' },
    '07:30': { state: 'empty' },
    '07:45': { state: 'empty' },
    '08:00': { state: 'empty' },
    '08:15': { state: 'empty' },
    '08:30': { state: 'empty' },
    '08:45': { state: 'empty' },
    '09:00': { state: 'empty' },
    '09:15': { state: 'empty' },
    '09:30': { state: 'empty' },
    '09:45': { state: 'empty' },
    '10:00': { state: 'empty' },
    '10:15': { state: 'empty' },
    '10:30': { state: 'empty' },
    '10:45': { state: 'empty' },
    '11:00': { state: 'empty' },
    '11:15': { state: 'empty' },
    '11:30': { state: 'empty' },
    '11:45': { state: 'empty' },
    '12:00': { state: 'empty' },
    '12:15': { state: 'empty' },
    '12:30': { state: 'empty' },
    '12:45': { state: 'empty' },
    '13:00': { state: 'empty' },
    '13:15': { state: 'empty' },
    '13:30': { state: 'empty' },
    '13:45': { state: 'empty' },
    '14:00': { state: 'empty' },
    '14:15': { state: 'empty' },
    '14:30': { state: 'empty' },
    '14:45': { state: 'empty' },
    '15:00': { state: 'empty' },
    '15:15': { state: 'empty' },
    '15:30': { state: 'empty' },
    '15:45': { state: 'empty' },
    '16:00': { state: 'empty' },
    '16:15': { state: 'empty' },
    '16:30': { state: 'empty' },
    '16:45': { state: 'empty' },
    '17:00': { state: 'empty' },
    '17:15': { state: 'empty' },
    '17:30': { state: 'empty' },
    '17:45': { state: 'empty' },
    '18:00': { state: 'empty' },
    '18:15': { state: 'empty' },
    '18:30': { state: 'empty' },
    '18:45': { state: 'empty' },
    '19:00': { state: 'empty' },
    '19:15': { state: 'empty' },
    '19:30': { state: 'empty' },
    '19:45': { state: 'empty' },
    '20:00': { state: 'empty' },
    '20:15': { state: 'empty' },
    '20:30': { state: 'empty' },
    '20:45': { state: 'empty' },
    '21:00': { state: 'empty' },
    '21:15': { state: 'empty' },
    '21:30': { state: 'empty' },
    '21:45': { state: 'empty' },
    '22:00': { state: 'empty' },
    '22:15': { state: 'empty' },
    '22:30': { state: 'empty' },
    '22:45': { state: 'empty' },
    '23:00': { state: 'empty' },
    '23:15': { state: 'empty' },
    '23:30': { state: 'empty' },
    '23:45': { state: 'empty' }
  },
  TUE: {
    '00:00': { state: 'empty' },
    '00:15': { state: 'empty' },
    '00:30': { state: 'empty' },
    '00:45': { state: 'empty' },
    '01:00': { state: 'empty' },
    '01:15': { state: 'empty' },
    '01:30': { state: 'empty' },
    '01:45': { state: 'empty' },
    '02:00': { state: 'empty' },
    '02:15': { state: 'empty' },
    '02:30': { state: 'empty' },
    '02:45': { state: 'empty' },
    '03:00': { state: 'empty' },
    '03:15': { state: 'empty' },
    '03:30': { state: 'empty' },
    '03:45': { state: 'empty' },
    '04:00': { state: 'empty' },
    '04:15': { state: 'empty' },
    '04:30': { state: 'empty' },
    '04:45': { state: 'empty' },
    '05:00': { state: 'empty' },
    '05:15': { state: 'empty' },
    '05:30': { state: 'empty' },
    '05:45': { state: 'empty' },
    '06:00': { state: 'empty' },
    '06:15': { state: 'empty' },
    '06:30': { state: 'empty' },
    '06:45': { state: 'empty' },
    '07:00': { state: 'empty' },
    '07:15': { state: 'empty' },
    '07:30': { state: 'empty' },
    '07:45': { state: 'empty' },
    '08:00': { state: 'empty' },
    '08:15': { state: 'empty' },
    '08:30': { state: 'empty' },
    '08:45': { state: 'empty' },
    '09:00': {
      id: null,
      owner_first_name: null,
      onwer_profile_image_url: null,
      owner_ref_id: null,
      day: 'TUE',
      startTime: 2021-03-15T16:00:00.000Z,
      activityType: null
    },
    '09:15': { state: 'empty' },
    '09:30': {
      id: null,
      owner_name: null,
      owner_pic: null,
      day: 'TUE',
      startTime: 2021-03-15T16:30:00.000Z,
      activityType: null
    },
    '09:45': { state: 'empty' },
    '10:00': {
      id: null,
      owner_name: null,
      owner_pic: null,
      day: 'TUE',
      startTime: 2021-03-15T17:00:00.000Z,
      activityType: null
    },
    '10:15': { state: 'empty' },
    '10:30': { state: 'empty' },
    '10:45': { state: 'empty' },
    '11:00': { state: 'empty' },
    '11:15': { state: 'empty' },
    '11:30': { state: 'empty' },
    '11:45': { state: 'empty' },
    '12:00': { state: 'empty' },
    '12:15': { state: 'empty' },
    '12:30': { state: 'empty' },
    '12:45': { state: 'empty' },
    '13:00': { state: 'empty' },
    '13:15': { state: 'empty' },
    '13:30': { state: 'empty' },
    '13:45': { state: 'empty' },
    '14:00': { state: 'empty' },
    '14:15': { state: 'empty' },
    '14:30': { state: 'empty' },
    '14:45': { state: 'empty' },
    '15:00': { state: 'empty' },
    '15:15': { state: 'empty' },
    '15:30': { state: 'empty' },
    '15:45': { state: 'empty' },
    '16:00': { state: 'empty' },
    '16:15': { state: 'empty' },
    '16:30': { state: 'empty' },
    '16:45': { state: 'empty' },
    '17:00': { state: 'empty' },
    '17:15': { state: 'empty' },
    '17:30': { state: 'empty' },
    '17:45': { state: 'empty' },
    '18:00': { state: 'empty' },
    '18:15': { state: 'empty' },
    '18:30': { state: 'empty' },
    '18:45': { state: 'empty' },
    '19:00': { state: 'empty' },
    '19:15': { state: 'empty' },
    '19:30': { state: 'empty' },
    '19:45': { state: 'empty' },
    '20:00': { state: 'empty' },
    '20:15': { state: 'empty' },
    '20:30': { state: 'empty' },
    '20:45': { state: 'empty' },
    '21:00': { state: 'empty' },
    '21:15': { state: 'empty' },
    '21:30': { state: 'empty' },
    '21:45': { state: 'empty' },
    '22:00': { state: 'empty' },
    '22:15': { state: 'empty' },
    '22:30': { state: 'empty' },
    '22:45': { state: 'empty' },
    '23:00': { state: 'empty' },
    '23:15': { state: 'empty' },
    '23:30': { state: 'empty' },
    '23:45': { state: 'empty' }
  },
  WED: {
    '00:00': { state: 'empty' },
    '00:15': { state: 'empty' },
    '00:30': { state: 'empty' },
    '00:45': { state: 'empty' },
    '01:00': { state: 'empty' },
    '01:15': { state: 'empty' },
    '01:30': { state: 'empty' },
    '01:45': { state: 'empty' },
    '02:00': { state: 'empty' },
    '02:15': { state: 'empty' },
    '02:30': { state: 'empty' },
    '02:45': { state: 'empty' },
    '03:00': { state: 'empty' },
    '03:15': { state: 'empty' },
    '03:30': { state: 'empty' },
    '03:45': { state: 'empty' },
    '04:00': { state: 'empty' },
    '04:15': { state: 'empty' },
    '04:30': { state: 'empty' },
    '04:45': { state: 'empty' },
    '05:00': { state: 'empty' },
    '05:15': { state: 'empty' },
    '05:30': { state: 'empty' },
    '05:45': { state: 'empty' },
    '06:00': { state: 'empty' },
    '06:15': { state: 'empty' },
    '06:30': { state: 'empty' },
    '06:45': { state: 'empty' },
    '07:00': { state: 'empty' },
    '07:15': { state: 'empty' },
    '07:30': { state: 'empty' },
    '07:45': { state: 'empty' },
    '08:00': { state: 'empty' },
    '08:15': { state: 'empty' },
    '08:30': { state: 'empty' },
    '08:45': { state: 'empty' },
    '09:00': { state: 'empty' },
    '09:15': { state: 'empty' },
    '09:30': { state: 'empty' },
    '09:45': { state: 'empty' },
    '10:00': { state: 'empty' },
    '10:15': { state: 'empty' },
    '10:30': { state: 'empty' },
    '10:45': { state: 'empty' },
    '11:00': { state: 'empty' },
    '11:15': { state: 'empty' },
    '11:30': { state: 'empty' },
    '11:45': { state: 'empty' },
    '12:00': { state: 'empty' },
    '12:15': { state: 'empty' },
    '12:30': { state: 'empty' },
    '12:45': { state: 'empty' },
    '13:00': { state: 'empty' },
    '13:15': { state: 'empty' },
    '13:30': { state: 'empty' },
    '13:45': { state: 'empty' },
    '14:00': { state: 'empty' },
    '14:15': { state: 'empty' },
    '14:30': { state: 'empty' },
    '14:45': { state: 'empty' },
    '15:00': { state: 'empty' },
    '15:15': { state: 'empty' },
    '15:30': { state: 'empty' },
    '15:45': { state: 'empty' },
    '16:00': { state: 'empty' },
    '16:15': { state: 'empty' },
    '16:30': { state: 'empty' },
    '16:45': { state: 'empty' },
    '17:00': { state: 'empty' },
    '17:15': { state: 'empty' },
    '17:30': { state: 'empty' },
    '17:45': { state: 'empty' },
    '18:00': { state: 'empty' },
    '18:15': { state: 'empty' },
    '18:30': { state: 'empty' },
    '18:45': { state: 'empty' },
    '19:00': { state: 'empty' },
    '19:15': { state: 'empty' },
    '19:30': { state: 'empty' },
    '19:45': { state: 'empty' },
    '20:00': { state: 'empty' },
    '20:15': { state: 'empty' },
    '20:30': { state: 'empty' },
    '20:45': { state: 'empty' },
    '21:00': { state: 'empty' },
    '21:15': { state: 'empty' },
    '21:30': { state: 'empty' },
    '21:45': { state: 'empty' },
    '22:00': { state: 'empty' },
    '22:15': { state: 'empty' },
    '22:30': { state: 'empty' },
    '22:45': { state: 'empty' },
    '23:00': { state: 'empty' },
    '23:15': { state: 'empty' },
    '23:30': { state: 'empty' },
    '23:45': { state: 'empty' }
  },
  THU: {
    '00:00': { state: 'empty' },
    '00:15': { state: 'empty' },
    '00:30': { state: 'empty' },
    '00:45': { state: 'empty' },
    '01:00': { state: 'empty' },
    '01:15': { state: 'empty' },
    '01:30': { state: 'empty' },
    '01:45': { state: 'empty' },
    '02:00': { state: 'empty' },
    '02:15': { state: 'empty' },
    '02:30': { state: 'empty' },
    '02:45': { state: 'empty' },
    '03:00': { state: 'empty' },
    '03:15': { state: 'empty' },
    '03:30': { state: 'empty' },
    '03:45': { state: 'empty' },
    '04:00': { state: 'empty' },
    '04:15': { state: 'empty' },
    '04:30': { state: 'empty' },
    '04:45': { state: 'empty' },
    '05:00': { state: 'empty' },
    '05:15': { state: 'empty' },
    '05:30': { state: 'empty' },
    '05:45': { state: 'empty' },
    '06:00': { state: 'empty' },
    '06:15': { state: 'empty' },
    '06:30': { state: 'empty' },
    '06:45': { state: 'empty' },
    '07:00': { state: 'empty' },
    '07:15': { state: 'empty' },
    '07:30': { state: 'empty' },
    '07:45': { state: 'empty' },
    '08:00': { state: 'empty' },
    '08:15': { state: 'empty' },
    '08:30': { state: 'empty' },
    '08:45': { state: 'empty' },
    '09:00': { state: 'empty' },
    '09:15': { state: 'empty' },
    '09:30': { state: 'empty' },
    '09:45': { state: 'empty' },
    '10:00': { state: 'empty' },
    '10:15': { state: 'empty' },
    '10:30': { state: 'empty' },
    '10:45': { state: 'empty' },
    '11:00': { state: 'empty' },
    '11:15': { state: 'empty' },
    '11:30': { state: 'empty' },
    '11:45': { state: 'empty' },
    '12:00': { state: 'empty' },
    '12:15': { state: 'empty' },
    '12:30': { state: 'empty' },
    '12:45': { state: 'empty' },
    '13:00': { state: 'empty' },
    '13:15': { state: 'empty' },
    '13:30': { state: 'empty' },
    '13:45': { state: 'empty' },
    '14:00': { state: 'empty' },
    '14:15': { state: 'empty' },
    '14:30': { state: 'empty' },
    '14:45': { state: 'empty' },
    '15:00': { state: 'empty' },
    '15:15': { state: 'empty' },
    '15:30': { state: 'empty' },
    '15:45': { state: 'empty' },
    '16:00': { state: 'empty' },
    '16:15': { state: 'empty' },
    '16:30': { state: 'empty' },
    '16:45': { state: 'empty' },
    '17:00': { state: 'empty' },
    '17:15': { state: 'empty' },
    '17:30': { state: 'empty' },
    '17:45': { state: 'empty' },
    '18:00': { state: 'empty' },
    '18:15': { state: 'empty' },
    '18:30': { state: 'empty' },
    '18:45': { state: 'empty' },
    '19:00': { state: 'empty' },
    '19:15': { state: 'empty' },
    '19:30': { state: 'empty' },
    '19:45': { state: 'empty' },
    '20:00': { state: 'empty' },
    '20:15': { state: 'empty' },
    '20:30': { state: 'empty' },
    '20:45': { state: 'empty' },
    '21:00': { state: 'empty' },
    '21:15': { state: 'empty' },
    '21:30': { state: 'empty' },
    '21:45': { state: 'empty' },
    '22:00': { state: 'empty' },
    '22:15': { state: 'empty' },
    '22:30': { state: 'empty' },
    '22:45': { state: 'empty' },
    '23:00': { state: 'empty' },
    '23:15': { state: 'empty' },
    '23:30': { state: 'empty' },
    '23:45': { state: 'empty' }
  },
  FRI: {
    '00:00': { state: 'empty' },
    '00:15': { state: 'empty' },
    '00:30': { state: 'empty' },
    '00:45': { state: 'empty' },
    '01:00': { state: 'empty' },
    '01:15': { state: 'empty' },
    '01:30': { state: 'empty' },
    '01:45': { state: 'empty' },
    '02:00': { state: 'empty' },
    '02:15': { state: 'empty' },
    '02:30': { state: 'empty' },
    '02:45': { state: 'empty' },
    '03:00': { state: 'empty' },
    '03:15': { state: 'empty' },
    '03:30': { state: 'empty' },
    '03:45': { state: 'empty' },
    '04:00': { state: 'empty' },
    '04:15': { state: 'empty' },
    '04:30': { state: 'empty' },
    '04:45': { state: 'empty' },
    '05:00': { state: 'empty' },
    '05:15': { state: 'empty' },
    '05:30': { state: 'empty' },
    '05:45': { state: 'empty' },
    '06:00': { state: 'empty' },
    '06:15': { state: 'empty' },
    '06:30': { state: 'empty' },
    '06:45': { state: 'empty' },
    '07:00': { state: 'empty' },
    '07:15': { state: 'empty' },
    '07:30': { state: 'empty' },
    '07:45': { state: 'empty' },
    '08:00': { state: 'empty' },
    '08:15': { state: 'empty' },
    '08:30': { state: 'empty' },
    '08:45': { state: 'empty' },
    '09:00': { state: 'empty' },
    '09:15': { state: 'empty' },
    '09:30': { state: 'empty' },
    '09:45': { state: 'empty' },
    '10:00': { state: 'empty' },
    '10:15': { state: 'empty' },
    '10:30': { state: 'empty' },
    '10:45': { state: 'empty' },
    '11:00': { state: 'empty' },
    '11:15': { state: 'empty' },
    '11:30': { state: 'empty' },
    '11:45': { state: 'empty' },
    '12:00': { state: 'empty' },
    '12:15': { state: 'empty' },
    '12:30': { state: 'empty' },
    '12:45': { state: 'empty' },
    '13:00': { state: 'empty' },
    '13:15': { state: 'empty' },
    '13:30': { state: 'empty' },
    '13:45': { state: 'empty' },
    '14:00': { state: 'empty' },
    '14:15': { state: 'empty' },
    '14:30': { state: 'empty' },
    '14:45': { state: 'empty' },
    '15:00': { state: 'empty' },
    '15:15': { state: 'empty' },
    '15:30': { state: 'empty' },
    '15:45': { state: 'empty' },
    '16:00': { state: 'empty' },
    '16:15': { state: 'empty' },
    '16:30': { state: 'empty' },
    '16:45': { state: 'empty' },
    '17:00': { state: 'empty' },
    '17:15': { state: 'empty' },
    '17:30': { state: 'empty' },
    '17:45': { state: 'empty' },
    '18:00': { state: 'empty' },
    '18:15': { state: 'empty' },
    '18:30': { state: 'empty' },
    '18:45': { state: 'empty' },
    '19:00': { state: 'empty' },
    '19:15': { state: 'empty' },
    '19:30': { state: 'empty' },
    '19:45': { state: 'empty' },
    '20:00': { state: 'empty' },
    '20:15': { state: 'empty' },
    '20:30': { state: 'empty' },
    '20:45': { state: 'empty' },
    '21:00': { state: 'empty' },
    '21:15': { state: 'empty' },
    '21:30': { state: 'empty' },
    '21:45': { state: 'empty' },
    '22:00': { state: 'empty' },
    '22:15': { state: 'empty' },
    '22:30': { state: 'empty' },
    '22:45': { state: 'empty' },
    '23:00': { state: 'empty' },
    '23:15': { state: 'empty' },
    '23:30': { state: 'empty' },
    '23:45': { state: 'empty' }
  },
  SAT: {
    '00:00': { state: 'empty' },
    '00:15': { state: 'empty' },
    '00:30': { state: 'empty' },
    '00:45': { state: 'empty' },
    '01:00': { state: 'empty' },
    '01:15': { state: 'empty' },
    '01:30': { state: 'empty' },
    '01:45': { state: 'empty' },
    '02:00': { state: 'empty' },
    '02:15': { state: 'empty' },
    '02:30': { state: 'empty' },
    '02:45': { state: 'empty' },
    '03:00': { state: 'empty' },
    '03:15': { state: 'empty' },
    '03:30': { state: 'empty' },
    '03:45': { state: 'empty' },
    '04:00': { state: 'empty' },
    '04:15': { state: 'empty' },
    '04:30': { state: 'empty' },
    '04:45': { state: 'empty' },
    '05:00': { state: 'empty' },
    '05:15': { state: 'empty' },
    '05:30': { state: 'empty' },
    '05:45': { state: 'empty' },
    '06:00': { state: 'empty' },
    '06:15': { state: 'empty' },
    '06:30': { state: 'empty' },
    '06:45': { state: 'empty' },
    '07:00': { state: 'empty' },
    '07:15': { state: 'empty' },
    '07:30': { state: 'empty' },
    '07:45': { state: 'empty' },
    '08:00': { state: 'empty' },
    '08:15': { state: 'empty' },
    '08:30': { state: 'empty' },
    '08:45': { state: 'empty' },
    '09:00': { state: 'empty' },
    '09:15': { state: 'empty' },
    '09:30': { state: 'empty' },
    '09:45': { state: 'empty' },
    '10:00': { state: 'empty' },
    '10:15': { state: 'empty' },
    '10:30': { state: 'empty' },
    '10:45': { state: 'empty' },
    '11:00': { state: 'empty' },
    '11:15': { state: 'empty' },
    '11:30': { state: 'empty' },
    '11:45': { state: 'empty' },
    '12:00': { state: 'empty' },
    '12:15': { state: 'empty' },
    '12:30': { state: 'empty' },
    '12:45': { state: 'empty' },
    '13:00': { state: 'empty' },
    '13:15': { state: 'empty' },
    '13:30': { state: 'empty' },
    '13:45': { state: 'empty' },
    '14:00': { state: 'empty' },
    '14:15': { state: 'empty' },
    '14:30': { state: 'empty' },
    '14:45': { state: 'empty' },
    '15:00': { state: 'empty' },
    '15:15': { state: 'empty' },
    '15:30': { state: 'empty' },
    '15:45': { state: 'empty' },
    '16:00': { state: 'empty' },
    '16:15': { state: 'empty' },
    '16:30': { state: 'empty' },
    '16:45': { state: 'empty' },
    '17:00': { state: 'empty' },
    '17:15': { state: 'empty' },
    '17:30': { state: 'empty' },
    '17:45': { state: 'empty' },
    '18:00': { state: 'empty' },
    '18:15': { state: 'empty' },
    '18:30': { state: 'empty' },
    '18:45': { state: 'empty' },
    '19:00': { state: 'empty' },
    '19:15': { state: 'empty' },
    '19:30': { state: 'empty' },
    '19:45': { state: 'empty' },
    '20:00': { state: 'empty' },
    '20:15': { state: 'empty' },
    '20:30': { state: 'empty' },
    '20:45': { state: 'empty' },
    '21:00': { state: 'empty' },
    '21:15': { state: 'empty' },
    '21:30': { state: 'empty' },
    '21:45': { state: 'empty' },
    '22:00': { state: 'empty' },
    '22:15': { state: 'empty' },
    '22:30': { state: 'empty' },
    '22:45': { state: 'empty' },
    '23:00': { state: 'empty' },
    '23:15': { state: 'empty' },
    '23:30': { state: 'empty' },
    '23:45': { state: 'empty' }
  },
  SUN: {
    '00:00': { state: 'empty' },
    '00:15': { state: 'empty' },
    '00:30': { state: 'empty' },
    '00:45': { state: 'empty' },
    '01:00': { state: 'empty' },
    '01:15': { state: 'empty' },
    '01:30': { state: 'empty' },
    '01:45': { state: 'empty' },
    '02:00': { state: 'empty' },
    '02:15': { state: 'empty' },
    '02:30': { state: 'empty' },
    '02:45': { state: 'empty' },
    '03:00': { state: 'empty' },
    '03:15': { state: 'empty' },
    '03:30': { state: 'empty' },
    '03:45': { state: 'empty' },
    '04:00': { state: 'empty' },
    '04:15': { state: 'empty' },
    '04:30': { state: 'empty' },
    '04:45': { state: 'empty' },
    '05:00': { state: 'empty' },
    '05:15': { state: 'empty' },
    '05:30': { state: 'empty' },
    '05:45': { state: 'empty' },
    '06:00': { state: 'empty' },
    '06:15': { state: 'empty' },
    '06:30': { state: 'empty' },
    '06:45': { state: 'empty' },
    '07:00': { state: 'empty' },
    '07:15': { state: 'empty' },
    '07:30': { state: 'empty' },
    '07:45': { state: 'empty' },
    '08:00': { state: 'empty' },
    '08:15': { state: 'empty' },
    '08:30': { state: 'empty' },
    '08:45': { state: 'empty' },
    '09:00': { state: 'empty' },
    '09:15': { state: 'empty' },
    '09:30': { state: 'empty' },
    '09:45': { state: 'empty' },
    '10:00': { state: 'empty' },
    '10:15': { state: 'empty' },
    '10:30': { state: 'empty' },
    '10:45': { state: 'empty' },
    '11:00': { state: 'empty' },
    '11:15': { state: 'empty' },
    '11:30': { state: 'empty' },
    '11:45': { state: 'empty' },
    '12:00': { state: 'empty' },
    '12:15': { state: 'empty' },
    '12:30': { state: 'empty' },
    '12:45': { state: 'empty' },
    '13:00': { state: 'empty' },
    '13:15': { state: 'empty' },
    '13:30': { state: 'empty' },
    '13:45': { state: 'empty' },
    '14:00': { state: 'empty' },
    '14:15': { state: 'empty' },
    '14:30': { state: 'empty' },
    '14:45': { state: 'empty' },
    '15:00': { state: 'empty' },
    '15:15': { state: 'empty' },
    '15:30': { state: 'empty' },
    '15:45': { state: 'empty' },
    '16:00': { state: 'empty' },
    '16:15': { state: 'empty' },
    '16:30': { state: 'empty' },
    '16:45': { state: 'empty' },
    '17:00': { state: 'empty' },
    '17:15': { state: 'empty' },
    '17:30': { state: 'empty' },
    '17:45': { state: 'empty' },
    '18:00': { state: 'empty' },
    '18:15': { state: 'empty' },
    '18:30': { state: 'empty' },
    '18:45': { state: 'empty' },
    '19:00': { state: 'empty' },
    '19:15': { state: 'empty' },
    '19:30': { state: 'empty' },
    '19:45': { state: 'empty' },
    '20:00': { state: 'empty' },
    '20:15': { state: 'empty' },
    '20:30': { state: 'empty' },
    '20:45': { state: 'empty' },
    '21:00': { state: 'empty' },
    '21:15': { state: 'empty' },
    '21:30': { state: 'empty' },
    '21:45': { state: 'empty' },
    '22:00': { state: 'empty' },
    '22:15': { state: 'empty' },
    '22:30': { state: 'empty' },
    '22:45': { state: 'empty' },
    '23:00': { state: 'empty' },
    '23:15': { state: 'empty' },
    '23:30': { state: 'empty' },
    '23:45': { state: 'empty' }
  }
}
*/