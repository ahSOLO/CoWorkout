import Slot from "./Slot";

import { Typography } from "@material-ui/core";
import "./styles.scss";

// 96 15-minute intervals in a day
const intervals = [...Array(96).keys()]

export default function Day(props) {
  const slots = intervals.map( interval => {
    return (
      <Slot content={interval + 1} />
    )
  })
  return (
    <div className="container__slots">
      {slots}
    </div>
  )
}

