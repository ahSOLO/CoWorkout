import axios from './fakeAxios';
// import axios from 'axios';
import { useEffect, useState } from 'react';
import MainRouter from './components/MainRouter';
import './basic.scss';

// mat-ui theme
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#FBB03B'
    },
    secondary: {
      main: '#23262A'
    }
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
    }
  }
})

function App() {
  // console.log('Rerendered');  

  // const checkLogin = function() {
  //   axios.get('/api/user/testuser')
  //     .then((data) => {
  //       console.log(data);
  //     })
  // }();

  // Basic implementation of getting user data, need to replace
  const [userObj, setUserObj ] = useState(null);

  const getUserObj = function() {
    axios.get('/api/user/testuser')
      .then((data) => setUserObj(data));
  }

  useEffect(() => {
    getUserObj();
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <div>
        <nav>CoWorkout</nav>
        <MainRouter user={userObj} />
        <br/> <br/>
      </div>
    </ThemeProvider>
  );
}

export default App;
