import Slot from "./Slot";
import axios from 'fakeAxios';
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



// transform props.slots into usable data
const renderSlots = function(slotsForDay) {
  let slots = [];
  for (const slot in slotsForDay) {
  slots.push(
    <Slot content={slotsForDay[slot]} status={} />
    )
  }
  // console.log(slotsForDay);
  return slots;
}

export default function Day(props) {

  return (
    <div className="container__slots">
      {renderSlots(props.slots)}
    </div>
  )
}

