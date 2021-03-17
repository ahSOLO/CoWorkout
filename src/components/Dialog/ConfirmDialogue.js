import { useState } from "react";
import { Box, Avatar, Typography, Dialog, DialogTitle, DialogContent, Button } from '@material-ui/core';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import moment from 'moment';

export default function ConfirmDialogue(props) {
  return (
    <Dialog onClose={props.handleConfirmClose} open={props.confirmOpen}>
      <Box display="flex" flexDirection="row-reverse" alignItems="center" width="100%">
        <Box marginTop="10px" marginRight="10px">
          <CloseOutlinedIcon className="clickable" onClick={props.handleConfirmClose}/>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center">
        <Typography variant="h4">Confirm Session</Typography>
      </Box>
      <DialogContent>
        <Typography variant="body1">
          Please confirm you would like to schedule this session:
        </Typography>
        <Typography variant="body1">
          {moment(props.data.start_time).format("dddd, MMM do [at] h:mm")} with {props.data.session_users[0].user_first_name}
        </Typography>
        <br/>
        <Box display="flex" justifyContent="center">
          <Button>
            Confirm
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
