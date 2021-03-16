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

  return (
    <div className="slot">
      <Typography>
        {props.content}
      </Typography>
    </div>
  )
}