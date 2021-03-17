import {Typography, Button } from '@material-ui/core';
import DialogueTemplate from "./DialogueTemplate";

export default function BookDialogue(props) {
  return (
    <DialogueTemplate
      handleClose = {props.handleBookClose}
      open = {props.bookOpen}
      title = "Book a Workout"
      content = {
        <>
          <Typography variant="body1">
            insert content here
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