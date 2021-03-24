import React, { useContext, useReducer } from 'react';
import {Link} from 'react-router-dom';
import {Typography, Box} from '@material-ui/core';
import {useHistory} from 'react-router-dom';
import {useState, useEffect} from 'react';
import ContextContainer from 'contexts/ContextContainer';
import MenuOutlinedIcon from '@material-ui/icons/MenuOutlined';
import "./SideNav.scss";

const hidePaths = ["/", "/register", "/workout-call"];

export default function SideNav(props) {
  const history = useHistory();
  const [hide, setHide] = useState(false);
  const [minimized, setMinimized] = useState(true);

  const { appState, setAppState, renderUpcoming, handleLogOut } = useContext(ContextContainer);

  useEffect(() => {
    // Hide the navbar if the current url matches one of the hide paths
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

  // render the upcoming sessions when user changes.
  useEffect(() => {
    renderUpcoming();
    // Update the upcoming sessions lists automatically every 2 minutes
    const interval = setInterval(() => {
      renderUpcoming();
    }, 120000);
    return (() => {
    clearInterval(interval)
    });
  }, [props.user])

  const clickHandler = () => {
    setMinimized(!minimized);
  }

  if (hide) return null;

  // Do not render if there is no logged in user
  if (!props.user.user_id) return null;

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
          <Typography variant="subtitle1" id="upcoming-sessions">
            <b><u>Upcoming Sessions</u></b></Typography>
            <br/>
            {appState.upcoming}
          <Typography variant="subtitle1"><b>See All</b></Typography>
      </Box>
      <Box display="flex" flexDirection="column" width="100%">
        <Typography className="clickable" onClick={() => history.push('/dashboard')}><b>Home</b></Typography>
        <br/>
        <Typography className="clickable" onClick={() => history.push('/dashboard')}><b>Our Guidelines</b></Typography>
        <br/>
        <Typography className="clickable" onClick={() => history.push('/profile')}><b>My Profile &amp; Preferences</b></Typography>
        <br/>
        <Typography className="clickable" onClick={handleLogOut}><b>Sign Out</b></Typography>
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