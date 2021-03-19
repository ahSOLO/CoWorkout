import { Typography, Box } from "@material-ui/core";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';

export default function Error(props){
  return(
    <Box display="flex" justifyContent="space-between" width="100%" alignItems="center" paddingLeft="5px" paddingRight="5px">
      <Typography variant="body2" color="error"> Error </Typography>
      {props.hover && <CloseOutlinedIcon className="clickable" onClick={() => props.setMode("EMPTY")}/>}
    </Box>
  )
}