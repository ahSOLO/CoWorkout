import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const RedButton = withStyles({
  root: {
    backgroundColor: "#f44336",
    color: "#FFFFFF",
    '&:hover': {
      backgroundColor: "#d32f2f",
      color: "#FFFFFF",
    },
    '&:active': {
      color: "#FFFFFF",
      backgroundColor: "#e57373",
    },
  }
})(Button)

export default RedButton;