import { useState, useEffect } from "react";

import { Typography } from "@material-ui/core";
import "./styles.scss";

import Empty from "./Empty";
import Booked from "./Booked";
import Matching from "./Matching";
import Matched from "./Matched";
import Status from "./Status";
import Error from "./Error";

const EMPTY = "EMPTY";
const BOOKED = "BOOKED";
const MATCHING = "MATCHING";
const MATCHED = "MATCHED";
const LOADING = "LOADING";
const ERROR = "ERROR";

export default function Slot(props) {
  const [mode, setMode] = useState(EMPTY);

  useEffect(() => {
    if (props.content === 0) setMode(EMPTY);
    if (props.content === 2) setMode(BOOKED);
    if (props.content === 4) setMode(MATCHING);
    if (props.content === 6) setMode(MATCHED);
    if (props.content === 8) setMode(LOADING);
    if (props.content === 10) setMode(ERROR);
  }, [])

  return (
    <div className="slot">
      {mode === EMPTY && <Empty/>}
      {mode === BOOKED && <Booked/>}
      {mode === MATCHING && <Matching/>}
      {mode === MATCHED && <Matched/>}
      {mode === LOADING && <Status/>}
      {mode === ERROR && <Error/>}
    </div>
  )
}