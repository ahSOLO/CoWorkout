import { useState } from "react";
import CancelDialog from "components/Dialogs/CancelDialog";
import { Box, Typography } from "@material-ui/core";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';

export default function Matching(props){
  const [cancelOpen, setCancelOpen] = useState(false);

  const handleCancelClick = () => {
    setCancelOpen(true);
  }
  const handleCancelClose = () => {
    props.setHover(false);
    setCancelOpen(false);
  }

  return(
    <>
      <Box display="flex" justifyContent="space-between" width="100%" alignItems="center" paddingLeft="5px" paddingRight="5px">
        <Typography variant="body2"> Matching... </Typography>
        {props.hover && 
          <CloseOutlinedIcon 
            className="clickable"
            onClick={handleCancelClick}
          />}
      </Box>
      <CancelDialog
        data={props.data}
        user={props.user}
        setMode={props.setMode}
        refreshSlots={props.refreshSlots}
        targetDay={props.targetDay}
        handleCancelClose={handleCancelClose}
        cancelOpen={cancelOpen}
      />
    </>
  )
}