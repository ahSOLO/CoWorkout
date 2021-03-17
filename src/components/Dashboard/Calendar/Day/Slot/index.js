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

  useEffect(() => {
    if (props.data.state === 'empty') setMode(EMPTY);
    else if (props.data.state === 'pending') {
      setMode(BOOKED); // somebody other than you has booked and you're able to match - i.e. there is at least 1 person (not you) associated with a 'pending' session
      // setMode(MATCHING); // you booked and you're able to match with others - i.e. you're the owner of a 'pending' session and the only person associated with it
      // setMode(MATCHED); // match is completed - i.e. there are 2 people associated with a 'pending' session
    }
  }, [props.data.state])

  // console.log(props.content.state);

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
