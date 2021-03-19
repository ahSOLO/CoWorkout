import Slot from "./Slot";
import axios from 'fakeAxios';
// import axios from 'axios';

import { Typography } from "@material-ui/core";
import "./styles.scss";

export default function Day(props) {

  // transform props.slots into usable data
  const renderSlots = function(slotsForDay) {
    let slots = [];
    for (const slot in slotsForDay) {
    slots.push(
      <Slot user={props.user} data={slotsForDay[slot]} date={props.date} />
      )
    }
    // console.log(slotsForDay);
    return slots;
  }

  return (
    <div className="container__slots">
      {renderSlots(props.slots)}
    </div>
  )
}

