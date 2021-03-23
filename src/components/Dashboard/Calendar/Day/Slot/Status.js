import { CircularProgress, Box } from '@material-ui/core';

export default function Status(props){
  return(
    <Box display="flex" justifyContent="center" height="80%" width="100%">
      <CircularProgress/>
    </Box>
  )
}