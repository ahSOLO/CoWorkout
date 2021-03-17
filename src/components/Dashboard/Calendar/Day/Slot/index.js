import { useState, useEffect } from "react";

import "./styles.scss";

import Empty from "./Empty";
import Booked from "./Booked";
import Matching from "./Matching";
import Matched from "./Matched";
import Status from "./Status";
import Error from "./Error";
import { hoverHandler } from "helpers/utility";

const EMPTY = "EMPTY";
const BOOKED = "BOOKED";
const MATCHING = "MATCHING";
const MATCHED = "MATCHED";
const LOADING = "LOADING";
const ERROR = "ERROR";

export default function Slot(props) {
  // console.log('ran slot index');
  const [mode, setMode] = useState(EMPTY);
  const [hover, setHover] = useState(false);
  

  console.log("render");

  useEffect(() => {
    if (props.status === 'empty') setMode(EMPTY);
    if (props.status === 'pending') setMode(BOOKED); //somebody other than you has booked and you're able to match
    if (props.status === 4) setMode(MATCHING); // you booked and you're able to match with others
    if (props.status === 'active') setMode(MATCHED); // match is completed
    if (props.status === 8) setMode(LOADINGstatusoading
    if (props.status === 10) setMode(ERROR); // error
  }, [mode, props.content.state])
  console.log(props.content.state);

  return (
    <div className="slot" 
      onMouseEnter={() => hoverHandler(setHover, true)}
      onMouseLeave={() => hoverHandler(setHover, false)}>
        {mode === EMPTY && <Empty hover={hover}/>}
        {mode === BOOKED && <Booked hover={hover} content={props.content} />}
        {mode === MATCHING && <Matching hover={hover}/>}
        {mode === MATCHED && <Matched hover={hover}/>}
        {mode === LOADING && <Status />}
        {mode === ERROR && <Error hover={hover}/>}
    </div>
  )
}
