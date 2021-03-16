import { useState } from 'react';
import axios from '../../../../fakeAxios';
// import axios from 'axios';

import Slot from './Slot';

export default function Day(props) {
  // EXPECTED PROPS:
  // targetDate
  
  const [ sessions, setSessions ] = useState('');
  
  axios.get('/api/sessions')
  .then((data) => {
      setSessions(data);
    }
  )

  
  
  const showSlots = function(sessionsData) {
    let sessionsForDay = [];
    for (const session of sessionsData) {
      sessionsForDay.push(<Slot key={session.id}/>);
    }
    return sessionsForDay;
  }
  

  return (
    <div className="day">
      {showSlots(sessions)}
    </div>
  )
}