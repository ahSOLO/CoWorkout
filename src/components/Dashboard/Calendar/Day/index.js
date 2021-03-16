import Slot from "./Slot";

import { Typography } from "@material-ui/core";
import "./styles.scss";

export default function Day(props) {
  // 42 15-minute intervals in a day
  const intervals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42];
  const slots = intervals.map( interval => {
    return (
      <Slot content={interval} />
    )
  })
  return (
    <div className="container__slots">
      {slots}
    </div>
  )
}

