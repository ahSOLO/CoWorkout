import { useHistory } from 'react-router-dom';
import { Button, Box } from '@material-ui/core';

export default function Landing(props) {
  const history = useHistory();

  return (
    <>
      <h1>Landing Page</h1>
      <Box>
        <Button onClick={() => history.push("/register")}>
          Register
        </Button>
        <Button onClick={() => history.push("/login")}>
          Log In
        </Button>
        <Button onClick={() => history.push("/dashboard")}>
          Go to Dashboard
        </Button>
      </Box>
    </>
  )
}