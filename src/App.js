import './App.css';
import axios from './fakeAxios';
// import axios from 'axios';
import MainRouter from './components/MainRouter';

function App() {
  console.log('Rerendered');
  const checkLogin = function() {
    axios.get('/api/user/testuser')
      .then((data) => {
        console.log(data);
      })
  }();

  return (
    <div>
      <nav>CoWorkout</nav>
      
    </div>
  );
}

export default App;
