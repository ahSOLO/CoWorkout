import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import About from './About';
import Dashboard from './Dashboard';
import Login from './Login';
import Logout from './Logout';
import Registration from './Registration';
import Settings from './Settings';
import Account from './Account';
import Leaderboard from './Leaderboard';
import Rewards from './Rewards';
import Friends from './Friends';
import Profile from './Profile';
import WorkoutCall from './WorkoutCall';

const MainRouter = (props) => {
  return (
    <main>
      <Router>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/login">Login</Link>
          <Link to="/logout">Logout</Link>
          <Link to="/register">Register</Link>
          <Link to="/settings">Settings</Link>
          <Link to="/account">Account</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/rewards">Rewards</Link>
          <Link to="/friends">Friends</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/workout-call">Workout Session</Link>
        </nav>

        <Switch>
          <Route path="/dashboard">
            <Dashboard user={props.user} />
          </Route>  
          <Route path="/login" >
            <Login/>
          </Route> 
          <Route path="/logout">
            <Logout/>
          </Route>
          <Route path="/register" >
            <Registration />
          </Route> 
          <Route path="/settings" >
            <Settings />
          </Route> 
          <Route path="/account">
            <Account />
          </Route> 
          <Route path="/leaderboard">
            <Leaderboard />  
          </Route>
          <Route path="/rewards">
            <Rewards />  
          </Route> 
          <Route path="/friends">
            <Friends />  
          </Route> 
          <Route path="/profile">
            <Profile user={props.user}/>  
          </Route>
          <Route path="/workout-call">
            <WorkoutCall user={props.user}/>  
          </Route> 
          <Route path="/">
            <About />  
          </Route> 
        </Switch>
      </Router>
    </main>
  )
};

export default MainRouter;