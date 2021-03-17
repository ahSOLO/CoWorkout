// fake data
const fakeData = {
  'GET': {
    '/api/user/testuser': {
      id: 1,
      first_name: 'Chuck',
      last_name: 'Norris',
      avatar: 'https://i.pravatar.cc/300',
      gender: 'Male',
      // add more as needed
    },



      // BOOKED - somebody other than you has booked and you're able to match - i.e. there is at least 1 person (not you) associated with a 'pending' session
      // MATCHING; // you booked and you're able to match with others - i.e. you're the owner of a 'pending' session and the only person associated with it
      // MATCHED; // match is completed - i.e. there are 2 people associated with a 'pending' session and you are one of the two
      // Don't need to get any pending sessions with 2 people where you are not one of the two
    
    '/api/sessions': [
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
      // matched appointments
      {
        id: 6,
        session_users: [{user_id: 7, user_first_name: 'Match1', user_profile_image_url: 'https://i.pravatar.cc/300'}, {user_id: 1, user_first_name: 'Chuck', user_profile_image_url: 'https://i.pravatar.cc/300'}],
        start_time: '2021-03-15T18:00:00.000Z',
        activity_type: 'yoga'
      },
      {
        id: 7,
        session_users: [{user_id: 7, user_first_name: 'Match2', user_profile_image_url: 'https://i.pravatar.cc/300'}, {user_id: 1, user_first_name: 'Chuck', user_profile_image_url: 'https://i.pravatar.cc/300'}],
        start_time: '2021-03-15T18:00:00.000Z',
        activity_type: 'circuit'
      }
    ]
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
    return fakePromise(fakeData['GET'][route]); 
  },
  post: function(route, params) {
    return fakePromise(fakeData['POST'][route]); 
  },
  delete: function(route, params) {
    return fakePromise(fakeData['DELETE'][route]); 
  }
}

export default axios;