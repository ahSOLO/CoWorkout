import {Typography, Button } from '@material-ui/core';
import DialogueTemplate from "./DialogueTemplate";
import moment from 'moment';
import axios from 'axios';

export default function CancelDialogue(props) {
  const otherUserString = props.otherUserData?
    `with ${props.otherUserData.user_first_name}`
    : "";

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Everything needed for the axios delete request (delete a session_users row): user id, session id
    console.log("USER ID", props.user.id);
    console.log("SESSION ID", props.data.id);
    axios.delete('/session_users', {user_id: props.user.id, session_id: props.data.id})
    .then( res => {
        console.log("Request Complete");
      }
    )
  }

  return (
    <DialogueTemplate
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
            {moment(props.data.start_time).format("dddd, MMM do [at] h:mm")} {otherUserString}
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