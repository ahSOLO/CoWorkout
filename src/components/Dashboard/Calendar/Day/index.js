import Slot from "./Slot";
import axios from '../../../../fakeAxios';
// import axios from 'axios';

import { Typography } from "@material-ui/core";
import "./styles.scss";

// 96 15-minute intervals in a day
const intervals = [...Array(96).keys()]
const fakeSessions = intervals.map( interval => {
  return (
    <Slot content={interval}/>
  )
})

export default function Day(props) {

  return (
    <div className="container__slots">
      {fakeSessions}
    </div>
  )
}

