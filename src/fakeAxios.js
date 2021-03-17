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
      // 3 appointments on the same timeslot
      {
        id: 1,
        state: 'pending',
        owner_first_name: 'Chuck',
        owner_profile_image_url: 'avatar',
        owner_ref_id: 'd93ghjfek',
        start_time: '2021-03-15T16:00:00.000Z',
        activity_type: 'napping'
      },
      {
        id: 2,
        state: 'pending',
        owner_first_name: 'Rick',
        owner_profile_image_url: 'avatar',
        owner_ref_id: 'dsa98f89b',
        start_time: '2021-03-15T16:00:00.000Z',
        activity_type: 'lounging'
      },
      {
        id: 3,
        state: 'pending',
        owner_first_name: 'Morty',
        owner_profile_image_url: 'avatar',
        owner_ref_id: 'fd938hgds',
        start_time: '2021-03-15T16:00:00.000Z',
        activity_type: 'sleeping'
      },
      // 1 appointment with no dups
      {
        id: 4,
        state: 'pending',
        owner_first_name: 'Coolguy',
        owner_profile_image_url: 'avatar',
        owner_ref_id: 'fdsegfgr0a',
        start_time: '2021-03-15T16:30:00.000Z',
        activity_type: 'sleeping'
      },
      // 2 more dup appointments
      {
        id: 5,
        state: 'pending',
        owner_first_name: 'Dup1',
        owner_profile_image_url: 'avatar',
        owner_ref_id: 'hjy5eje5',
        start_time: '2021-03-15T17:30:00.000Z',
        activity_type: 'sleeping'
      },
      {
        id: 6,
        state: 'pending',
        owner_first_name: 'Dup2',
        owner_profile_image_url: 'avatar',
        owner_ref_id: 'gvrf43hj6',
        start_time: '2021-03-15T17:30:00.000Z',
        activity_type: 'sleeping'
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