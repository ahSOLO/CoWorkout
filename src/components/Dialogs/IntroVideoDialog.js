import { Box, Typography, Dialog, DialogContent } from '@material-ui/core';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import "./IntroVideoDialog.scss";

export default function IntroVideoDialog(props) {
  return (
    <Dialog onClose={props.handleClose} open={props.open} fullWidth>
      <Box display="flex" flexDirection="row-reverse" alignItems="center" width="100%">
        <Box marginTop="10px" marginRight="10px">
          <CloseOutlinedIcon className="clickable" onClick={props.handleClose}/>
        </Box>
      </Box>
      <DialogContent>
        <div id="video-frame">        
          <iframe id="intro-video" src="https://streamable.com/e/trqn5e?autoplay=0&loop=0" frameborder="0" width="100%" height="100%" ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  )
}

