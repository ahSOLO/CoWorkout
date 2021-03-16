import { useState } from 'react';
import Slot from "./Slot";
import axios from '../../../../fakeAxios';
// import axios from 'axios';

import { Typography } from "@material-ui/core";
import "./styles.scss";

// 96 15-minute intervals in a day
const intervals = [...Array(96).keys()]



export default function Day(props) {
  const [ sessions, setSessions ] = useState('');
  axios.get('/api/sessions')
    .then((data) => {
        setSessions(data);
      }
    )
  const showSlots = function(sessionsData) {
    let sessionsForDay = [];
    for (const session of sessionsData) {
      sessionsForDay.push(<Slot key={session.id} content={"hello"} />);
    }
    return sessionsForDay;
  }
  return (
    <div className="container__slots">
      {showSlots(sessions)}
    </div>
  )
}

