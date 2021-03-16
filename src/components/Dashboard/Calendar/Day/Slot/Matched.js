import { Box, Avatar, Typography } from "@material-ui/core";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';

export default function Matched(props){
  return(
    <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
      <div className="slot__booked">
        <div className="slot__avatar">
          <Avatar src="https://i.pravatar.cc/300"/>
        </div>
        <div className="slot__name">
          <Typography variant="body2">
            Match Found!
          </Typography>
        </div>
      </div>
      <Box paddingRight="5px">
        <CloseOutlinedIcon className="clickable"/>
      </Box>
    </Box>
  )
}