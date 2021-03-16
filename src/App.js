import './App.scss';
// import axios from './fakeAxios';
// import axios from 'axios';
import MainRouter from './components/MainRouter';
import './basic.scss';

// How to import a mat-ui component + Icon
import Button from '@material-ui/core/Button';
import FaceIcon from '@material-ui/icons/Face';

function App() {
  console.log('Rerendered');

  // const checkLogin = function() {
  //   axios.get('/api/user/testuser')
  //     .then((data) => {
  //       console.log(data);
  //     })
  // }();

  return (
    <div>
      <nav>CoWorkout</nav>
      <MainRouter />
      {/* Example of mat-UI button + how to use an Icon */}
      <Button color='primary' variant='contained' size='large' startIcon={<FaceIcon/>}>Example mat-UI Button</Button>
    </div>
  );
}

export default App;
