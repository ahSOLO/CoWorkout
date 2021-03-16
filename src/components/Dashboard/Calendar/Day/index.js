import axios from '../../../../fakeAxios';
// import axios from 'axios';

export default function Day(props) {
  // EXPECTED PROPS:
  // targetDate

  axios.get('', {
    'params': {
      datetime: '2021-03-15 12:00:00'
    }
  })
    .then((data) => {
        console.log(data);
      }
    )

  return (
    <div className="day">
      day
    </div>
  )
}