import { Typography, Avatar, Box, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "./Header.scss";

const lightPaths = ["/", "/register", "/login"];

export default function Header(props) {
  const [style, setStyle] = useState("");
  const history = useHistory();

  const handleLogOut = event => {
    event.preventDefault();

    props.removeCookie("user_id", {
        path: "/"
    });

    props.setUser({});
    history.push("/");
  }

  const headerRight = function() {
    if (props.user.user_id) {
      return (
        <>
          <Button className="header__button" color="primary" variant="outlined" onClick={() => history.push("/workout-call")}>
            <b>Demo Video Call</b>
          </Button>
          <Button className="header__button" color="primary" variant="outlined" onClick={handleLogOut}>
            <b>Log Out</b>
          </Button>
          <Avatar className="header__avatar"/>
          <Typography variant="subtitle1" className="header__name">{props.user.name}</Typography>
        </>
      )
    } else {
      return (
        <>
          <Button className="header__button" color="primary" variant="outlined" onClick={() => history.push("/register")}>
            <b>Register</b>
          </Button>
          <Button className="header__button" color="primary" variant="outlined" onClick={() => history.push("/login")}>
            <b>Log In</b>
          </Button>
        </>
      )
    }
  }

  useEffect(() => {
    if (lightPaths.includes(history.location.pathname)) { 
      setStyle("light");
     } else {
      setStyle("dark");
     } ;
    const unlisten = history.listen((location, action) => {
      if (lightPaths.includes(location.pathname)) {
        setStyle("light");
      } else {
        setStyle("dark");
      }
    });
    return () => {
      unlisten();
    }
  }, [])

  return (
    <header id="app-header" className={style}>
      <Box paddingLeft="25px">
        <Typography variant="h4" className="clickable" onClick={() => props.user.user_id ? history.push("/dashboard") : history.push("/")}>CoWorkout</Typography>
      </Box>
      <Box paddingRight="50px" display="flex" alignItems="center" >
        {headerRight()}
      </Box>
    </header>
  )
}