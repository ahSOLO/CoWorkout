import { Box, Typography } from "@material-ui/core";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';

export default function Matching(props){
  return(
    <Box display="flex" justifyContent="space-between" width="100%" alignItems="center" paddingLeft="5px" paddingRight="5px">
      <Typography variant="body2"> Matching... </Typography>
      <CloseOutlinedIcon className="clickable"/>
    </Box>
  )
}