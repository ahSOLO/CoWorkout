import { useState } from "react";
import { Box, Avatar, Typography, Dialog, DialogTitle, DialogContent, Button } from '@material-ui/core';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import { hoverHandler } from "helpers/utility"

export default function Booked(props){
  const [leftHover, setLeftHover] = useState(false);
  const [rightHover, setRightHover] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleAvatarClick = () => {
    setProfileOpen(true);
  }

  const handleProfileClose = () => {
    setProfileOpen(false);
  }

  const handleConfirmClick = () => {
    setConfirmOpen(true);
  }

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  }

  return(
    <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
      <div className="slot__booked">
        <div className="slot__avatar">
          <Avatar 
            src={props.data.session_users[0].user_profile_image_url} 
            className="clickable"
            onMouseEnter = {() => hoverHandler(setLeftHover, true)}
            onMouseLeave = {() => hoverHandler(setLeftHover, false)}
            onClick= {handleAvatarClick}
          />
        </div>
        <div className="slot__name">
          <Typography variant="body2">
            {rightHover? "Schedule?"
            : leftHover? "View Profile?" 
            : props.data.session_users[0].user_first_name
            }
          </Typography>
        </div>
      </div>
      <Box paddingRight="5px">
        {props.hover && 
        <CheckCircleOutlineOutlinedIcon 
          htmlColor="#4caf50" 
          className="clickable"
          onMouseEnter = {() => hoverHandler(setRightHover, true)}
          onMouseLeave = {() => hoverHandler(setRightHover, false)}
          onClick= {handleConfirmClick}
          />}
      </Box>
      {/* Profile Dialogue */}
      <Dialog onClose={handleProfileClose} open={profileOpen}>
        <Typography variant="p">
          Make an axios request here to get the full profile information
        </Typography>
      </Dialog>
      {/* Confirm Booking Dialogue */}
      <Dialog onClose={handleConfirmClose} open={confirmOpen}>
        <DialogTitle>Confirm Session</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1">
            Please confirm you would like to schedule this session:
          </Typography>
          <Typography variant="subtitle1">
            {props.data.start_time.toString()} with {props.data.session_users[0].user_first_name}
          </Typography>
          <Button>
            Confirm
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
    )
}