// fake data
const fakeData = {
  'GET': {
    '/api/users': {
      id: 1,
      first_name: 'Chuck',
      last_name: 'Norris',
      avatar: 'img link',
      gender: 'Male',
      // add more as needed
    },
    '/api/sessions': {
      id: 1,
      // add more as needed
    }
  },

  'POST': {
    '/api/': {
      test: true
    }
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
    }, 100);
  });
  return fakePromise;
}

// fake axios
const axios = {
  get: function(route) {
    return fakePromise(fakeData['GET'][route]); 
  },
  post: function(route) {
    return fakePromise(fakeData['POST'][route]); 
  },
  delete: function(route) {
    return fakePromise(fakeData['DELETE'][route]); 
  }
}

export default axios;

// USAGE 

// import axios from './fakeAxios';
//
// axios.get('/api/users')
//   .then(data => {
//     console.log(data);
//   })




