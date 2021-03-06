import { Box, Typography, Dialog, DialogContent } from '@material-ui/core';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';

/* Requires the following props: 
  - handleClose (function)
  - open (state)
  - title (string)
  - content (jsx)
  - button (jsx)
*/

export default function DialogTemplate(props) {
  return (
    <Dialog onClose={props.handleClose} open={props.open}>
      <Box display="flex" flexDirection="row-reverse" alignItems="center" width="100%">
        <Box marginTop="10px" marginRight="10px">
          <CloseOutlinedIcon className="clickable" onClick={props.handleClose}/>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" padding="0px 20px">
        <Typography variant="h4">{props.title}</Typography>
      </Box>
      <DialogContent>
        <form onSubmit={props.onFormSubmit}>
          {props.content}
          <br/>
          <Box display="flex" justifyContent="center">
            {props.button}
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  )
}
