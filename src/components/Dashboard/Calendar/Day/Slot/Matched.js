import { useState, useEffect } from "react";
import { Box, Avatar, Typography } from "@material-ui/core";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import { hoverHandler } from "helpers/utility";

export default function Matched(props){
  const [leftHover, setLeftHover] = useState(false);
  const [otherUserData, setOtherUserData] = useState({});

  useEffect(() => {
    setOtherUserData(props.data.session_users.find(userObj => userObj.id !== props.user.id))
  }, [props.data])

  return(
    <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
      <div className="slot__booked">
        <div className="slot__avatar">
          <Avatar 
            src={otherUserData.user_profile_image_url}
            className="clickable"
            onMouseEnter = {() => hoverHandler(setLeftHover, true)}
            onMouseLeave = {() => hoverHandler(setLeftHover, false)}
          />
        </div>
        <div className="slot__name">
          <Typography variant="body2">
            {leftHover ? "View Profile?" : "Match Found!"}
          </Typography>
        </div>
      </div>
      <Box paddingRight="5px">
        {props.hover && <CloseOutlinedIcon className="clickable"/>}
      </Box>
    </Box>
  )
}