import {Typography, Button } from '@material-ui/core';
import DialogueTemplate from "./DialogueTemplate";

export default function ProfileDialogue(props) {
  return (
    <DialogueTemplate
      handleClose = {props.handleProfileClose}
      open = {props.profileOpen}
      content = {
        <>
          <Typography variant="body1">
            Do an axios request and insert user data here
          </Typography>
        </>
      }
    />
  )
}