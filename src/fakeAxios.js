// fake data
const fakeData = {
  'GET': {
    '/api/user/testuser': {
      id: 1,
      first_name: 'Chuck',
      last_name: 'Norris',
      avatar: 'img link',
      gender: 'Male',
      // add more as needed
    },
    '/api/sessions': [
      // FILTER RESULTS ON API SERVER SIDE
      {
        scheduled_at: '2021-03-15 12:00:00',
        state: 'pending',
        scheduled_duration: 30,
        owner_id: 1,
        owner_first_name: 'Chuck',
        owner_avatar: 'image'
      },
      {
        scheduled_at: '2021-03-15 12:00:00',
        state: 'pending',
        scheduled_duration: 30,
        owner_id: 1,
        owner_first_name: 'Chuck',
        owner_avatar: 'image'
      },
      {
        scheduled_at: '2021-03-15 13:00:00',
        state: 'pending',
        scheduled_duration: 30,
        owner_id: 1,
        owner_first_name: 'Chuck',
        owner_avatar: 'image'
      },
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
    }, 2000);
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