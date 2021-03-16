import { Box, Avatar, Typography } from '@material-ui/core'
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';

export default function Booked(props){
  return(
    <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
      <div className="slot__booked">
        <div className="slot__avatar">
          <Avatar src="https://i.pravatar.cc/300"/>
        </div>
        <div className="slot__name">
          <Typography variant="body2">
            Firstname L.
          </Typography>
        </div>
      </div>
      <Box paddingRight="5px">
        <CheckCircleOutlineOutlinedIcon htmlColor="#4caf50" className="clickable"/>
      </Box>
    </Box>
    )
}