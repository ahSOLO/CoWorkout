import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const JoinButton = withStyles({
  root: {
    backgroundColor: "grey",
    color: "#FFFFFF",
    '&:hover': {
      backgroundColor: "#23262A",
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