import {Typography, Button } from '@material-ui/core';
import DialogueTemplate from "./DialogueTemplate";
import moment from 'moment';

export default function CancelDialogue(props) {
  return (
    <DialogueTemplate
      handleClose = {props.handleCancelClose}
      open = {props.cancelOpen}
      title = "Cancel Session"
      content = {
        <>
          <Typography variant="body1">
            Please confirm you would like to cancel this session:
          </Typography>
          <Typography variant="body1">
            {moment(props.data.start_time).format("dddd, MMM do [at] h:mm")} with {props.otherUserData.user_first_name}
          </Typography>
        </>
      }
      button = {
        <Button>
          Cancel
        </Button>
      }
    />
  )
}