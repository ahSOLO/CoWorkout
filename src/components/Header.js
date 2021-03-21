import { Typography, Avatar, Box, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "./Header.scss";

const lightPaths = ["/", "/register"];

export default function Header(props) {
  const [style, setStyle] = useState("dark");
  const history = useHistory();

  const headerRight = function() {
    if (props.user) {
      return (
        <>
          <Avatar className="header__avatar"/>
          <Typography variant="subtitle1" className="header__name">Firstname H</Typography>
        </>
      )
    } else {
      return (
        <>
        <Button onClick={() => history.push("/register")}>
          Register
        </Button>
        <Button onClick={() => history.push("/login")}>
          Log In
        </Button>
        </>
      )
    }
  }

  useEffect(() => {
    if (lightPaths.includes(history.location.pathname)) setStyle(true);
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
        <Typography variant="h4" className="clickable" onClick={() => props.user ? history.push("/dashboard") : history.push("/")}>CoWorkout</Typography>
      </Box>
      <Box paddingRight="50px" display="flex" alignItems="center" >
        {headerRight()}
      </Box>
    </header>
  )
}