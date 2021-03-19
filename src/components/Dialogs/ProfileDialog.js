import {Typography, Button } from '@material-ui/core';
import DialogTemplate from "./DialogTemplate";

export default function ProfileDialog(props) {
  return (
    <DialogTemplate
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