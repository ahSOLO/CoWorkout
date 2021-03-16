import axios from './fakeAxios';
// import axios from 'axios';

export default function Day(props) {

  axios.get('', {
    'params': {
      datetime: '2021-03-15 12:00:00'
    }
  })
  
  return (
    <h1>Day</h1>
  )
}