import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
// import Home from './Home';
// import Products from './Products';

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
          <Link to="/settings">Products</Link>
          <Link to="/account">Account</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/rewards">Rewards</Link>
          <Link to="/friends">Friends</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/workout-call">Workout Session</Link>
        </nav>

        <Switch>
          <Route path="/about">
            <h2>About</h2>
          </Route>
          <Route path="/products" component={Products} /> 
          <Route path="/">
            <Home />
          </Route>
        </Switch>

      </Router>
    </main>
  )
};

export default MainRouter;