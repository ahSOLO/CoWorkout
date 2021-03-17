import { useState, useEffect } from "react";

import "./styles.scss";

import Empty from "./Empty";
import Booked from "./Booked";
import Matching from "./Matching";
import Matched from "./Matched";
import Status from "./Status";
import Error from "./Error";
import { hoverHandler } from "../../../../../helpers/utility";

const EMPTY = "EMPTY";
const BOOKED = "BOOKED";
const MATCHING = "MATCHING";
const MATCHED = "MATCHED";
const LOADING = "LOADING";
const ERROR = "ERROR";

export default function Slot(props) {
  const [mode, setMode] = useState(EMPTY);
  const [hover, setHover] = useState(false);

  console.log("render");

  useEffect(() => {
    if (props.content === 0) setMode(EMPTY);
    if (props.content === 2) setMode(BOOKED);
    if (props.content === 4) setMode(MATCHING);
    if (props.content === 6) setMode(MATCHED);
    if (props.content === 8) setMode(LOADING);
    if (props.content === 10) setMode(ERROR);
  }, [])

  return (
    <div className="slot" 
      onMouseEnter={() => hoverHandler(setHover, true)}
      onMouseLeave={() => hoverHandler(setHover, false)}>
        {mode === EMPTY && <Empty hover={hover}/>}
        {mode === BOOKED && <Booked hover={hover}/>}
        {mode === MATCHING && <Matching hover={hover}/>}
        {mode === MATCHED && <Matched hover={hover}/>}
        {mode === LOADING && <Status />}
        {mode === ERROR && <Error hover={hover}/>}
    </div>
  )
}
