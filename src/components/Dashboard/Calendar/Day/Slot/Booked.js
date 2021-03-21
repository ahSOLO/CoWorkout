import { useState, useEffect, useRef } from "react";
import { Box, Avatar, Typography, Dialog} from '@material-ui/core';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import { hoverHandler } from "helpers/utility"
import ConfirmDialog from "components/Dialogs/ConfirmDialog";
import ProfileDialog from "components/Dialogs/ProfileDialog";

export default function Booked(props){
  const [leftHover, setLeftHover] = useState(false);
  const [rightHover, setRightHover] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [avatarURL, setAvatarURL] = useState("");
  const [name, setName] = useState("");
  const floatRef = useRef();

  useEffect(() => {
    if (props.data.session_users.length > 0) {
      setAvatarURL(props.data.session_users[0].user_profile_image_url);
      setName(props.data.session_users[0].user_first_name);
    }
  }, [props.data.session_users])

  const handleAvatarClick = () => {
    setProfileOpen(true);
  }
  const handleProfileClose = () => {
    props.setHover(false);
    setLeftHover(false);
    setProfileOpen(false);
  }
  const handleConfirmClick = () => {
    setConfirmOpen(true);
  }
  const handleConfirmClose = () => {
    props.setHover(false);
    setRightHover(false);
    setConfirmOpen(false);
  }

  return(
    <Box display="flex" flexDirection="column" width="100%" alignItems="center">
      <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
        <div className="slot__booked">
          <div className="slot__avatar">
            <Avatar 
              src={avatarURL} 
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
              : name
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
        <ProfileDialog
          handleProfileClose={handleProfileClose}
          profileOpen={profileOpen}
        />
        <ConfirmDialog data={props.data} user={props.user} setMode={props.setMode} handleConfirmClose={handleConfirmClose} confirmOpen={confirmOpen} />
      </Box>
      {props.hover && <div className="slot__float">
        <Typography variant="body2">
          {props.activity}
        </Typography>
      </div>}
    </Box>
    )
}