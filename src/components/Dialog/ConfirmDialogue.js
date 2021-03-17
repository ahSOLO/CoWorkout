import { useState } from "react";
import { Box, Typography, Dialog, DialogContent, Button } from '@material-ui/core';
import DialogueTemplate from "./DialogueTemplate";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import moment from 'moment';

export default function ConfirmDialogue(props) {
  return (
    <DialogueTemplate
      handleClose = {props.handleConfirmClose}
      open = {props.confirmOpen}
      title = "Confirm Session"
      content = {
        <>
          <Typography variant="body1">
            Please confirm you would like to schedule this session:
          </Typography>
          <Typography variant="body1">
            {moment(props.data.start_time).format("dddd, MMM do [at] h:mm")} with {props.data.session_users[0].user_first_name}
          </Typography>
        </>
      }
      button = {
        <Button>
          Confirm
        </Button>
      }
    />
  )
}