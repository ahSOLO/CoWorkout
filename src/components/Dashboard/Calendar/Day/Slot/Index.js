import { useState } from "react";

import { Typography } from "@material-ui/core";
import "./styles.scss";

const EMPTY = "EMPTY";
const BOOKED = "BOOKED";
const MATCHING = "MATCHING";
const MATCHED = "MATCHED";
const LOADING = "LOADING";
const ERROR = "ERROR";

export default function Slot(props) {
  const [mode, setMode] = useState(EMPTY);

  if (props.content === 1) setMode(EMPTY);
  if (props.content === 2) setMode(BOOKED);
  if (props.content === 3) setMode(MATCHING);
  if (props.content === 4) setMode(MATCHED);
  if (props.content === 5) setMode(LOADING);
  if (props.content === 6) setMode(ERROR);

  return (
    <div className="slot">
      <Typography>
        {props.content}
      </Typography>
    </div>
  )
}