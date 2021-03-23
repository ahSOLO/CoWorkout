// import axios from './fakeAxios';
import {Typography} from '@material-ui/core';
import axios from 'axios';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import MainRouter from './components/MainRouter';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import useApplicationData from 'hooks/useApplicationData';
import ContextContainer from 'contexts/ContextContainer';

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

  const renderUpcoming = function() {
    if (!user) return;
    axios.get(BASE_URL + '/api/sessions', {params: {user_id: user.user_id, filter: {type: "upcoming"}}})
      .then( res => {
        setAppState({...appState, upcoming:
          res.data.sessions.map( session => {
            const users = session.session_users.map( user => JSON.parse(user));
            const otherUser = users.find( user_ => user_.user_id !== user.user_id)
            return (
              <>
                <Typography variant="body1">{moment(session.start_time).format("dddd, MMM Do [at] h:mm a")} {otherUser && "with " + otherUser.user_first_name}</Typography>
                <br/>
              </>
            )
          })
        })
      })
  };

  return (
    <ThemeProvider theme={theme}>
      <ContextContainer.Provider value={{appState, setAppState, renderUpcoming}}>
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
