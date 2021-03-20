import { Typography, Avatar, Box } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "./Header.scss";

const lightPaths = ["/", "/register"];

export default function Header(props) {
  const [style, setStyle] = useState("dark");
  const history = useHistory();


  useEffect(() => {
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
        <Typography variant="h4">CoWorkout</Typography>
      </Box>
      <Box paddingRight="50px" display="flex" alignItems="center" >
        <Avatar className="header__avatar"/>
        <Typography variant="subtitle1" className="header__name">Firstname H</Typography>
      </Box>
    </header>
  )
}