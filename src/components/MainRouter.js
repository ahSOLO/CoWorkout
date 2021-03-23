import { BrowserRouter as Router, useHistory, Route, Switch } from 'react-router-dom';
import { Box } from '@material-ui/core';
import Landing from './Landing';
import Dashboard from './Dashboard';
import Login from './Login';
import Registration from './Registration';
import Settings from './Settings';
import Account from './Account';
import Leaderboard from './Leaderboard';
import Rewards from './Rewards';
import Friends from './Friends';
import Profile from './Profile';
import WorkoutCall from './WorkoutCall';
import SideNav from './SideNav';
import Header from './Header';
import "./MainRouter.scss";

const MainRouter = (props) => {
  return (
    <main>
        <Header user={props.user} setUser={props.setUser} removeCookie={props.removeCookie} />
        <Box display="flex" justifyContent="stretch" height={"calc(100% - 40px)"} width="100%" position="fixed" marginTop="40px">
          <SideNav user={props.user} />
          <div id="main-container">
            <Switch>
              <Route path="/dashboard">
                <Dashboard user={props.user} />
              </Route>  
              <Route path="/login" >
                <Login user={props.user} setUser={props.setUser} cookies={props.cookies} setCookie={props.setCookie} />
              </Route> 
              <Route path="/register" >
                <Registration setUser={props.setUser} cookies={props.cookies} setCookie={props.setCookie} />
              </Route> 
              <Route path="/settings" >
                <Settings />
              </Route> 
              <Route path="/account">
                <Account />
              </Route> 
              <Route path="/leaderboard">
                <Leaderboard user={props.user} setUser={props.setUser} />  
              </Route>
              <Route path="/rewards">
                <Rewards />  
              </Route> 
              <Route path="/friends">
                <Friends />  
              </Route> 
              <Route path="/profile">
                <Profile user={props.user} setUser={props.setUser}/>  
              </Route>
              <Route path="/workout-call">
                <WorkoutCall user={props.user}/>  
              </Route> 
              <Route path="/">
                <Landing />  
              </Route> 
            </Switch>
          </div>
        </Box>
    </main>
  )
};

export default MainRouter;