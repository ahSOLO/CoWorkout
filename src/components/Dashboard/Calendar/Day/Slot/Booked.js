import { useState } from 'react';
import { Box, Avatar, Typography } from '@material-ui/core';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import { hoverHandler } from "../../../../../helpers/utility";

export default function Booked(props){
  const [leftHover, setLeftHover] = useState(false);
  const [rightHover, setRightHover] = useState(false);

  return(
    <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
      <div className="slot__booked">
        <div className="slot__avatar">
          <Avatar 
            src="https://i.pravatar.cc/300" 
            className="clickable"
            onMouseOver = {() => hoverHandler(setLeftHover, true)}
            onMouseOut = {() => hoverHandler(setLeftHover, false)}/>
        </div>
        <div className="slot__name">
          <Typography variant="body2">
            {rightHover? "Schedule?"
            : leftHover? "View Profile?" 
            : "Firstname L."}
          </Typography>
        </div>
      </div>
      <Box paddingRight="5px">
        {props.hover && 
        <CheckCircleOutlineOutlinedIcon 
          htmlColor="#4caf50" 
          className="clickable"
          onMouseOver = {() => hoverHandler(setRightHover, true)}
          onMouseOut = {() => hoverHandler(setRightHover, false)}
          />}
      </Box>
    </Box>
    )
}