import './App.scss';
// import axios from './fakeAxios';
// import axios from 'axios';
import MainRouter from './components/MainRouter';
import './basic.scss';

// mat-ui theme
import { makeStyles, ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core'

// How to import a mat-ui component + Icon
import Button from '@material-ui/core/Button';
import FaceIcon from '@material-ui/icons/Face';

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
    fontFamily: "'Montserrat', 'sans-serif'",
    fontWeightBold: 600,
    h1: {
      fontFamily: "'Raleway', sans-serif"
    },
    h2: {
      fontFamily: "'Raleway', sans-serif"
    },
    h3: {
      fontFamily: "'Raleway', sans-serif"
    },
    h4: {
      fontFamily: "'Raleway', sans-serif"
    },
    h5: {
      fontFamily: "'Raleway', sans-serif"
    },
    h6: {
      fontFamily: "'Raleway', sans-serif"
    }
  }
})

function App() {
  console.log('Rerendered');

  // const checkLogin = function() {
  //   axios.get('/api/user/testuser')
  //     .then((data) => {
  //       console.log(data);
  //     })
  // }();

  return (
    <ThemeProvider theme={theme}>
      <div>
        <nav>CoWorkout</nav>
        <MainRouter />
        <br/> <br/>
        {/* Example of mat-UI button + how to use an Icon */}
        <Button color='primary' variant='contained' size='large' startIcon={<FaceIcon/>}>Example mat-UI Button</Button>
      </div>
    </ThemeProvider>
  );
}

export default App;
