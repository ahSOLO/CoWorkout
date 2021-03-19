import {Typography, Button } from '@material-ui/core';
import DialogTemplate from "./DialogTemplate";
import moment from 'moment';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function ConfirmDialog(props) {

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Everything needed for the axios post request (create a new session_users row): user id, session id
    console.log("USER ID", props.user.id);
    console.log("SESSION ID", props.data.id);
    props.setMode("LOADING");
    props.handleConfirmClose();
    axios.post(BASE_URL + '/api/session_users', {user_id: props.user.id, session_id: props.data.id})
      .then( res => {
        if (res.status===201) {
          props.setMode("MATCHED");
        } else {
          props.setMode("ERROR");
        }
      })
  }

  return (
    <DialogTemplate
      handleClose = {props.handleConfirmClose}
      open = {props.confirmOpen}
      title = "Confirm Session"
      onFormSubmit={handleFormSubmit}
      content = {
        <>
          <Typography variant="body1">
            Please confirm you would like to schedule this session:
          </Typography>
          <Typography variant="body1">
            {moment(props.data.start_time).format("dddd, MMM do [at] h:mm")} with {JSON.parse(props.data.session_users[0]).user_first_name}
          </Typography>
        </>
      }
      button = {
        <Button type="submit">
          Confirm
        </Button>
      }
    />
  )
}