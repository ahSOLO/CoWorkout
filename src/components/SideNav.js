import {Link} from 'react-router-dom';
import {useHistory} from 'react-router-dom';
import {useState, useEffect} from 'react';
import "./SideNav.scss";

const hidePaths = ["/", "/register", "/workout-call"];

export default function SideNav(props) {
  const history = useHistory();
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      if (hidePaths.includes(location.pathname)) {
        setHide(true);
      } else {
        setHide(false);
      }
    });
    return () => {
      unlisten();
    }
  }, [])


  console.log(history);

  if (hide) return null;

  return (
    <nav id="app-sidenav">
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
  )
}