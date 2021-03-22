import {Typography, Button } from '@material-ui/core';
import DialogTemplate from "./DialogTemplate";
import moment from 'moment';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function CancelDialog(props) {
  const otherUserString = props.otherUserData?
    `with ${props.otherUserData.user_first_name}`
    : "";

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Everything needed for the axios delete request (delete a session_users row): user id, session id
    console.log("USER ID", props.user.user_id);
    console.log("SESSION ID", props.data.id || props.newSessionId);
    props.setMode("LOADING");
    props.handleCancelClose();
    // Axios request will also change the session state to canceled if cancelling user is the only pending user of the session.
    axios.put(BASE_URL + '/api/session_users/cancel', {user_id: props.user.user_id, session_id: props.data.id || props.newSessionId})
    .then( res => {
      if (res.status===201) {
        props.setMode("LOADING");
        setTimeout(() => {
          props.refreshSlots();
        }, 1000);
      } else {
        props.setMode("ERROR");
      }
    })
  }

  return (
    <DialogTemplate
      handleClose = {props.handleCancelClose}
      open = {props.cancelOpen}
      title = "Cancel Session"
      onFormSubmit={handleFormSubmit}
      content = {
        <>
          <Typography variant="body1">
            Please confirm you would like to cancel this session:
          </Typography>
          <Typography variant="body1">
            { props.data.start_time ? moment(props.data.start_time).format("dddd, MMM Do [at] h:mm") 
            : moment(props.date).set({ "hour": props.data.hour, "minute": props.data.minute }).format("dddd, MMM Do [at] h:mm")} {otherUserString}
          </Typography>
        </>
      }
      button = {
        <Button type="submit">
          Cancel
        </Button>
      }
    />
  )
}