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

// {
//   id: 1,
//   session_users: [{user_id: 1, user_first_name: 'Chuck', user_profile_image_url: '...'}, {user_id: 2, user_first_name: 'Chuck', user_profile_image_url: '...'}]
//   start_time: '2021-03-15T16:00:00.000Z',
//   activity_type: 'napping'
// },

export default function Slot(props) {
  const [mode, setMode] = useState(EMPTY);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const usersNum = props.data.session_users.length;
    if (usersNum === 0) {
      setMode(EMPTY);
    } else if (usersNum === 1) {
      const isMySession = props.user && Boolean(props.data.session_users[0].user_id === props.user.id);
      // MATCHING: you booked and you're able to match with others - i.e. you're the owner of a 'pending' session and the only person associated with it
      // BOOKED: somebody other than you has booked and you're able to match - i.e. there is at least 1 person (not you) associated with a 'pending' session
      isMySession? setMode(MATCHING) : setMode(BOOKED);      
    } else if (usersNum === 2) {
      // MATCHED: match is completed - i.e. there are 2 people associated with a 'pending' session and you are one of the two
      setMode(MATCHED);
    }
  }, [props.data, props.user])

  return (
    <div className="slot" 
      onMouseEnter={() => hoverHandler(setHover, true)}
      onMouseLeave={() => hoverHandler(setHover, false)}>
        {mode === EMPTY && <Empty hover={hover} setHover={setHover} setMode={setMode} data={props.data} date={props.date} user={props.user}/>}
        {mode === BOOKED && <Booked hover={hover} setHover={setHover} setMode={setMode} data={props.data} user={props.user} />}
        {mode === MATCHING && <Matching hover={hover} setHover={setHover} setMode={setMode} data={props.data} user={props.user} refreshSlots={props.refreshSlots} targetDay={props.targetDay}/>}
        {mode === MATCHED && <Matched hover={hover} setHover={setHover} setMode={setMode} data={props.data} user={props.user} refreshSlots={props.refreshSlots} targetDay={props.targetDay}/>}
        {mode === LOADING && <Status setMode={setMode} />}
        {mode === ERROR && <Error hover={hover} setHover={setHover} setMode={setMode} refreshSlots={props.refreshSlots} targetDay={props.targetDay}/>}
    </div>
  )
}
