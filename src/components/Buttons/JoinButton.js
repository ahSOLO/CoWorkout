import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const JoinButton = withStyles({
  root: {
    backgroundColor: "#23262A",
    color: "#FFFFFF",
    '&:hover': {
      backgroundColor: "black",
      color: "#FFFFFF",
      boxShadow: 'none',
    },
    '&:active': {
      boxShadow: 'none',
      color: "#FFFFFF",
      backgroundColor: "grey",
    },
  }
})(Button)

export default JoinButton;