import {Link} from 'react-router-dom';
import {Typography, Box} from '@material-ui/core';
import {useHistory} from 'react-router-dom';
import {useState, useEffect} from 'react';
import MenuOutlinedIcon from '@material-ui/icons/MenuOutlined';
import "./SideNav.scss";

const hidePaths = ["/", "/register", "/workout-call"];

export default function SideNav(props) {
  const history = useHistory();
  const [hide, setHide] = useState(false);
  const [minimized, setMinimized] = useState(true);

  useEffect(() => {
    if (hidePaths.includes(history.location.pathname)) setHide(true);
    const unlisten = history.listen((location, action) => {
      if (hidePaths.includes(location.pathname)) {
        setHide(true);
      } else {
        setHide(false);
      }
    });
    return () => {
      unlisten();
    }
  }, [])

  const clickHandler = () => {
    setMinimized(!minimized);
  }

  if (hide) return null;

  if (minimized) return (
    <nav id="app-mininav">
      <MenuOutlinedIcon className="clickable" id="menu-icon-minimized" onClick={clickHandler}/>
    </nav>
  )

  return (
    <nav id="app-sidenav">
      <Box display="flex" flexDirection="column" width="100%">
        <Box display="flex" flexDirection="row-reverse" width="100%">
          <MenuOutlinedIcon className="clickable" id="menu-icon" onClick={clickHandler}/>
        </Box>
        <Typography variant="subtitle1" id="upcoming-sessions"><b><u>Upcoming Sessions</u></b></Typography>
        <br/>
        <Typography variant="body1">DayOfWeek, Month 10 at 8:15am with Firstname</Typography>
        <br/>
        <Typography variant="body1">DayOfWeek, Month 10 at 8:15am (Matching...)</Typography>
        <br/>
        <Typography variant="body1">DayOfWeek, Month 10 at 8:15am with Firstname</Typography>
        <br/>
        <Typography variant="subtitle1"><b>See All</b></Typography>
      </Box>
      <Box display="flex" flexDirection="column" width="100%">
        <Typography><b>Debug Links (Will replace for production)</b></Typography>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/settings">Settings</Link>
        <Link to="/account">Account</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/rewards">Rewards</Link>
        <Link to="/friends">Friends</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/workout-call">Workout Session</Link>
      </Box>
      <Box display="flex" flexDirection="column" width="100%">
        <Typography variant="body2">About</Typography>
        <br/>
        <Typography variant="body2">Contact Us</Typography>
        <br/>
        <Typography variant="body2">Terms &amp; Conditions</Typography>
      </Box>
    </nav>
  )
}