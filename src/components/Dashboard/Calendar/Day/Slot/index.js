import { useState, useEffect } from "react";
import debounce from 'lodash.debounce';

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
  const [hover, setHover] = useState(false);

  const hoverHandler = function (hoverState) {
    debounce(() => setHover(hoverState), 75)();
  }

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
      onMouseOver={() => hoverHandler(true)}
      onMouseOut={() => hoverHandler(false)}>
        {mode === EMPTY && <Empty hover={hover}/>}
        {mode === BOOKED && <Booked hover={hover}/>}
        {mode === MATCHING && <Matching hover={hover}/>}
        {mode === MATCHED && <Matched hover={hover}/>}
        {mode === LOADING && <Status />}
        {mode === ERROR && <Error hover={hover}/>}
    </div>
  )
}
