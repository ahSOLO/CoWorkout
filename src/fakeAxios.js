// fake data
const fakeData = {
  'GET': {
    '/api/user/testuser': {
      'default': { // default means no params are passed through axios.get
        id: 1,
        first_name: 'Chuck',
        last_name: 'Norris',
        avatar: 'https://i.pravatar.cc/300',
        gender: 'Male',
        timezone: 'Asia/Singapore'
        // add more as needed
      },
    },
    
    '/api/sessions': {
      'default': [// default means no params are passed through axios.get

        // 3 appointments on the same timeslot
        {
          id: 1,
          session_users: [{user_id: 2, user_first_name: 'Chuck', user_profile_image_url: 'https://i.pravatar.cc/300'}],
          start_time: '2021-03-15T16:00:00.000Z',
          activity_type: 'napping'
        },
        {
          id: 2,
          session_users: [{user_id: 3, user_first_name: 'Sandy', user_profile_image_url: 'https://i.pravatar.cc/300'}],
          start_time: '2021-03-15T16:00:00.000Z',
          activity_type: 'napping'
        },
        {
          id: 3,
          session_users: [{user_id: 4, user_first_name: 'Sandy', user_profile_image_url: 'https://i.pravatar.cc/300'}],
          start_time: '2021-03-15T16:00:00.000Z',
          activity_type: 'lounging'
        },

        // 1 appointment with no dups
        {
          id: 4,
          session_users: [{user_id: 5, user_first_name: 'Coolguy', user_profile_image_url: 'https://i.pravatar.cc/300'}],
          start_time: '2021-03-15T16:30:00.000Z',
          activity_type: 'lounging'
        },

        // 2 more dup appointments
        {
          id: 5,
          session_users: [{user_id: 6, user_first_name: 'Dup1', user_profile_image_url: 'https://i.pravatar.cc/300'}],
          start_time: '2021-03-15T17:30:00.000Z',
          activity_type: 'sleeping'
        },
        {
          id: 6,
          session_users: [{user_id: 7, user_first_name: 'Dup2', user_profile_image_url: 'https://i.pravatar.cc/300'}],
          start_time: '2021-03-15T17:30:00.000Z',
          activity_type: 'sleeping'
        },
      ],

      'start_date': [

        // 3 appointments on the same timeslot
        {
          id: 1,
          session_users: [{user_id: 2, user_first_name: 'Chuck', user_profile_image_url: 'https://i.pravatar.cc/300'}],
          start_time: '2021-03-15T16:00:00.000Z',
          activity_type: 'napping'
        },
        {
          id: 2,
          session_users: [{user_id: 3, user_first_name: 'Sandy', user_profile_image_url: 'https://i.pravatar.cc/300'}],
          start_time: '2021-03-15T16:00:00.000Z',
          activity_type: 'napping'
        },
        {
          id: 3,
          session_users: [{user_id: 4, user_first_name: 'Sandy', user_profile_image_url: 'https://i.pravatar.cc/300'}],
          start_time: '2021-03-15T16:00:00.000Z',
          activity_type: 'lounging'
        },

        // 1 appointment with no dups
        {
          id: 4,
          session_users: [{user_id: 5, user_first_name: 'Coolguy', user_profile_image_url: 'https://i.pravatar.cc/300'}],
          start_time: '2021-03-15T16:30:00.000Z',
          activity_type: 'lounging'
        },

        // 2 more dup appointments
        {
          id: 5,
          session_users: [{user_id: 6, user_first_name: 'Dup1', user_profile_image_url: 'https://i.pravatar.cc/300'}],
          start_time: '2021-03-15T17:30:00.000Z',
          activity_type: 'sleeping'
        },
        {
          id: 6,
          session_users: [{user_id: 7, user_first_name: 'Dup2', user_profile_image_url: 'https://i.pravatar.cc/300'}],
          start_time: '2021-03-15T17:30:00.000Z',
          activity_type: 'sleeping'
        },
      ],

      // APPOINTMENTS THAT THE USER HAS MADE OR MATCHED WITH
      'current_user': [ // axios.get('/api/sessions', {params: {current_user: <value is ignored>}}); /api/sessions?current_user=<value is ignored>
        // matched appointments
        {
          id: 6,
          session_users: [{user_id: 7, user_first_name: 'Match1', user_profile_image_url: 'https://i.pravatar.cc/300'}, {user_id: 1, user_first_name: 'Chuck', user_profile_image_url: 'https://i.pravatar.cc/300'}],
          start_time: '2021-03-15T18:00:00.000Z',
          activity_type: 'yoga'
        },
        {
          id: 7,
          session_users: [{user_id: 8, user_first_name: 'Match2', user_profile_image_url: 'https://i.pravatar.cc/300'}, {user_id: 1, user_first_name: 'Chuck', user_profile_image_url: 'https://i.pravatar.cc/300'}],
          start_time: '2021-03-15T18:00:00.000Z',
          activity_type: 'circuit'
        }
      ],
    }

    
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