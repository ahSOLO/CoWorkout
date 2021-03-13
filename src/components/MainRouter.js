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

const MainRouter = () => {
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
          <Route path="/dashboard" component={Dashboard} /> 
          <Route path="/login" component={Login} /> 
          <Route path="/logout" component={Logout} /> 
          <Route path="/register" component={Registration} /> 
          <Route path="/settings" component={Settings} /> 
          <Route path="/account" component={Account} /> 
          <Route path="/leaderboard" component={Leaderboard} /> 
          <Route path="/rewards" component={Rewards} /> 
          <Route path="/friends" component={Friends} /> 
          <Route path="/profile" component={Profile} /> 
          <Route path="/workout-call" component={WorkoutCall} /> 
          <Route path="/" component={About} /> 
        </Switch>

      </Router>
    </main>
  )
};

export default MainRouter;