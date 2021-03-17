import axios from './fakeAxios';
import { useEffect, useState } from 'react';
// import axios from 'axios';
import MainRouter from './components/MainRouter';
import './basic.scss';

// mat-ui theme
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

// How to import a mat-ui component + Icon
import Button from '@material-ui/core/Button';
import FaceIcon from '@material-ui/icons/Face';
import userEvent from '@testing-library/user-event';

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

  const [userObj, setUserObj ] = useState(null);

  export const getUserObj = function() {
    axios.get('/api/user/testuser')
      .then((data) => setState(data));
  }

  useEffect(() => {
    getUserObj
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <div>
        <nav>CoWorkout</nav>
        <MainRouter user={userObj} />
        <br/> <br/>
        {/* Example of mat-UI button + how to use an Icon */}
        <Button color='primary' variant='contained' size='large' startIcon={<FaceIcon/>}>Example mat-UI Button</Button>
      </div>
    </ThemeProvider>
  );
}

export default App;
