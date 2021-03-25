// import axios from './fakeAxios';
import {Typography, Box} from '@material-ui/core';
import axios from 'axios';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import MainRouter from './components/MainRouter';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import useApplicationData from 'hooks/useApplicationData';
import ContextContainer from 'contexts/ContextContainer';
import { fifteenMinutesInMs } from "helpers/constants";
import JoinButton from "components/Buttons/JoinButton";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#FBB03B'
    },
    secondary: {
      main: '#23262A'
    },
  },
  typography: {
    fontFamily: "'Raleway', sans-serif",
    fontWeightBold: 600,
    h1: {
      fontFamily: "'Montserrat', 'sans-serif'"
    },
    h2: {
      fontFamily: "'Montserrat', 'sans-serif'"
    },
    h3: {
      fontFamily: "'Montserrat', 'sans-serif'"
    },
    h4: {
      fontFamily: "'Montserrat', 'sans-serif'"
    },
    h5: {
      fontFamily: "'Montserrat', 'sans-serif'"
    },
    h6: {
      fontFamily: "'Montserrat', 'sans-serif'"
    },
    h7: {
      fontFamily: "'Montserrat', 'sans-serif'"
    },
    subtitle1: {
      fontFamily: "'Montserrat', 'sans-serif'"
    }
  }
})

function App() {
  const [appState, setAppState] = useState({
    upcoming: <br/>,
  })
  const { user, setUser, cookies, setCookie, removeCookie } = useApplicationData();
  const history = useHistory();

  // Renders the upcoming sessions displayed in the sidenav - need to put in App.js so we can include it in the global object and have it be called from calendar actions
  const renderUpcoming = function() {
    if (!user) return;
    axios.get(BASE_URL + '/api/sessions', {params: {user_id: user.user_id, filter: {type: "upcoming"}}})
      .then( res => {
        setAppState({...appState, upcoming:
          res.data.sessions.map( session => {
            const users = session.session_users.map( user => JSON.parse(user));
            const otherUser = users.find( user_ => user_.user_id !== user.user_id);
            const startTimeObj = moment(session.start_time);
            const msToStart = Math.abs(moment().diff(startTimeObj));
            return (
              <>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">{startTimeObj.format("dddd, MMM Do [at] h:mma")} {otherUser && "with " + otherUser.user_first_name}</Typography>
                  {(msToStart < fifteenMinutesInMs && otherUser) && <JoinButton size="small" onClick={() => history.push(`/workout-call/${session.session_uuid}`)}><b>JOIN</b></JoinButton>}
                </Box>
                <br/>
              </>
            )
          })
        })
      })
  }

  // Logs out the user
  const handleLogOut = event => {
    event.preventDefault();

    removeCookie("user_id", {
        path: "/"
    });

    setUser({});
    history.push("/");
  }

  return (
    <ThemeProvider theme={theme}>
      <ContextContainer.Provider value={{appState, setAppState, renderUpcoming, handleLogOut}}>
        <MainRouter 
          user={user} 
          setUser={setUser}
          cookies={cookies}
          setCookie={setCookie}
          removeCookie={removeCookie}
        />
      </ContextContainer.Provider>
    </ThemeProvider>
  );
}

export default App;
