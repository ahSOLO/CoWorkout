import { useState, useEffect } from "react";
import { Box, Avatar, Typography } from "@material-ui/core";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import { hoverHandler } from "helpers/utility";
import ProfileDialog from "components/Dialogs/ProfileDialog";
import CancelDialog from "components/Dialogs/CancelDialog";

export default function Matched(props){
  const [leftHover, setLeftHover] = useState(false);
  const [otherUserData, setOtherUserData] = useState({});
  const [profileOpen, setProfileOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const handleAvatarClick = () => {
    setProfileOpen(true);
  }
  const handleProfileClose = () => {
    props.setHover(false);
    setLeftHover(false);
    setProfileOpen(false);
  }
  const handleCancelClick = () => {
    setCancelOpen(true);
  }
  const handleCancelClose = () => {
    props.setHover(false);
    setCancelOpen(false);
  }

  useEffect(() => {
    if (props.user){
      setOtherUserData(props.data.session_users.find(userObj => JSON.parse(userObj).id !== props.user.id))
    }
  }, [props.data, props.user])

  return(
    <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
      <div className="slot__booked">
        <div className="slot__avatar">
          <Avatar 
            src={otherUserData.user_profile_image_url}
            className="clickable"
            onMouseEnter = {() => hoverHandler(setLeftHover, true)}
            onMouseLeave = {() => hoverHandler(setLeftHover, false)}
            onClick={handleAvatarClick}
          />
        </div>
        <div className="slot__name">
          <Typography variant="body2">
            {leftHover ? "View Profile?" : "Match Found!"}
          </Typography>
        </div>
      </div>
      <Box paddingRight="5px">
        {props.hover && <CloseOutlinedIcon className="clickable" onClick={handleCancelClick}/>}
      </Box>

      <ProfileDialog
        data={props.data}
        handleProfileClose={handleProfileClose}
        profileOpen={profileOpen}  
      />
      <CancelDialog
        data={props.data}
        user={props.user}
        setMode={props.setMode}
        refreshSlots={props.refreshSlots}
        targetDay={props.targetDay}
        otherUserData={otherUserData}
        handleCancelClose={handleCancelClose}
        cancelOpen={cancelOpen}
      />
    </Box>
  )
}