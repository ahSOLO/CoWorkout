import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const GreenButton = withStyles({
  root: {
    backgroundColor: "#4caf50",
    color: "#23262A",
    '&:hover': {
      backgroundColor: "#388e3c",
      color: "#23262A",
    },
    '&:active': {
      color: "#000000",
      backgroundColor: "#81c784",
    },
  }
})(Button)

export default GreenButton;