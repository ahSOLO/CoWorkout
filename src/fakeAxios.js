// classes to make fake data more concise
class User {
  constructor(id, user_first_name, last_name, user_profile_image_url, gender, timezone) {
    this.id = id;
    this.user_id = id; // user_id being used in some places
    this.user_first_name = user_first_name;
    this.last_name = last_name;
    this.user_profile_image_url = user_profile_image_url;
    this.gender = gender;
    this.timezone = timezone;
  }
}

class Appointment {
  constructor(id, session_users, start_time, activity_type) {
    this.id = id;
    this.session_users = session_users;
    this.start_time = start_time;
    this.activity_type = activity_type;
  }
}

// fake objects
const user1 = new User(1, 'Chuck', 'Norris', 'https://i.pravatar.cc/300', 'Male', 'America/Vancouver');
const user2 = new User(2, 'Stan', 'Lee', 'https://i.pravatar.cc/300', 'Male', 'Asia/Singapore');
const user3 = new User(3, 'Bruce', 'Lee', 'https://i.pravatar.cc/300', 'Male', 'Asia/Singapore');
const user4 = new User(4, 'Rick', 'Astley', 'https://i.pravatar.cc/300', 'Male', 'Asia/Singapore');
const user5 = new User(5, 'Kevin', 'Malone', 'https://i.pravatar.cc/300', 'Male', 'Asia/Singapore');

// fake appointments

// same timeslot (booked)
const appointment1 = new Appointment(1, [user2], '2021-03-15T16:00:00.000Z', 'napping');
const appointment2 = new Appointment(2, [user3], '2021-03-15T16:00:00.000Z', 'napping');
const appointment3 = new Appointment(3, [user4], '2021-03-15T16:00:00.000Z', 'napping');
// different timeslots (booked)
const appointment4 = new Appointment(4, [user5], '2021-03-15T17:00:00.000Z', 'napping');
const appointment5 = new Appointment(5, [user3], '2021-03-15T18:00:00.000Z', 'napping');
// matching
const appointment6 = new Appointment(6, [user1], '2021-03-15T19:00:00.000Z', 'napping');
const appointment7 = new Appointment(7, [user1], '2021-03-15T20:00:00.000Z', 'napping');
// matched
const appointment8 = new Appointment(8, [user2, user1], '2021-03-15T21:00:00.000Z', 'napping');
const appointment9 = new Appointment(9, [user3, user1], '2021-03-15T22:00:00.000Z', 'napping');
const appointment10 = new Appointment(10, [user1, user2], '2021-03-15T23:00:00.000Z', 'napping');
// matched, but does not involve user1
const appointment11 = new Appointment(11, [user2, user3], '2021-03-15T23:30:00.000Z', 'napping');

// More appointments
// same timeslot (booked)
const appointment12 = new Appointment(12, [user2], '2021-03-15T07:00:00.000Z', 'napping');
const appointment13 = new Appointment(13, [user3], '2021-03-15T07:00:00.000Z', 'napping');
const appointment14 = new Appointment(14, [user4], '2021-03-15T07:00:00.000Z', 'napping');
// different timeslots (booked)
const appointment15 = new Appointment(15, [user5], '2021-03-15T07:30:00.000Z', 'napping');
const appointment16 = new Appointment(16, [user3], '2021-03-15T08:00:00.000Z', 'napping');
// matching
const appointment17 = new Appointment(17, [user1], '2021-03-15T08:30:00.000Z', 'napping');
const appointment18 = new Appointment(18, [user1], '2021-03-15T09:00:00.000Z', 'napping');
// matched
const appointment19 = new Appointment(19, [user2, user1], '2021-03-15T15:00:00.000Z', 'napping');
const appointment20 = new Appointment(20, [user3, user1], '2021-03-15T16:00:00.000Z', 'napping');
const appointment21 = new Appointment(21, [user1, user2], '2021-03-15T17:00:00.000Z', 'napping');

// fake data
const fakeData = {
  'GET': {
    '/api/user/testuser': {
      'default': user1,
    },
    
    '/api/sessions': {
      'start_date': {
        'data': {
          'rows': [
            // 3 appointments on the same timeslot
            appointment1,
            appointment2,
            appointment3,
            // 2 appointments with no dups
            appointment4,
            appointment5,
            appointment6,
            appointment7,
            // More appointments
            appointment12,
            appointment13,
            appointment14,
            appointment15,
            appointment16,
            appointment17,
            appointment18,
          ]
        }
      },
      // APPOINTMENTS THAT THE USER HAS MADE OR MATCHED WITH
      // axios.get('/api/sessions', {params: {current_user: <value is ignored>}}); /api/sessions?current_user=<value is ignored>
      'current_user': {
        'data': {
          'rows': [ 
            // matched appointments
            appointment8,
            appointment9,
            appointment10,
            appointment19,
            appointment20,
            appointment21
          ]
        }
      }
    },

    
  },

  'POST': {
    '/api/': {
      test: true
    },
    
  },

  'DELETE': {
    '/api/': {
      test: true
    }
  }
}

// fake delayed promise
const fakePromise = function(fakeData) {
  const fakePromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fakeData);
    }, 1);
  });
  return fakePromise;
}

// fake axios
const axios = {
  get: function(route, params) {
    if (!params) {
      params = 'default';
    } else {
      params = Object.keys(params.params)[0];
    }

    return fakePromise(fakeData['GET'][route][params]); 
  },
  post: function(route, params) {
    if (!params) {
      params = 'default';
    } else {
      params = Object.keys(params.params)[0];
    }
    return fakePromise(fakeData['POST'][route][params]); 
  },
  delete: function(route, params) {
    if (!params) {
      params = 'default';
    } else {
      params = Object.keys(params.params)[0];
    }
    return fakePromise(fakeData['DELETE'][route][params]); 
  }
}

// usage examples
// axios.get('/api/sessions')
// .then((data) => {
//   console.log('test call /api/sessions')
//   console.log(data);
// })

// axios.get('/api/sessions', { params: {
//   current_user: 'someUser'
// }})
// .then((data) => {
//   console.log('test call /api/sessions?current_user=someUser')
//   console.log(data);
// })

// axios.get('/api/user/testuser')
// .then((data) => {
//   console.log('test call /api/user/testuser')
//   console.log(data);
// })

export default axios;