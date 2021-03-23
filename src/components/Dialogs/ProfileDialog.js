import { useState, useEffect } from "react";
import { Typography, Button, Avatar, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Box from "@material-ui/core/Box";
import DialogTemplate from "./DialogTemplate";
import Popover from '@material-ui/core/Popover';
import "./ProfileDialog.scss";
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const useStyles = makeStyles((theme) => ({
  popup__profile__avatar: {
    width: theme.spacing(16),
    height: theme.spacing(16)
  },
  popover: {
    pointerEvents: 'none',
  }
}));

export default function ProfileDialog(props) {
  const classes = useStyles();
  const [user, setUser] = useState({});

  const [anchorEl, setAnchorEl] = useState(null);
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const handlePopoverOpen2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handlePopoverClose2 = () => {
    setAnchorEl2(null);
  };
  const open2 = Boolean(anchorEl2);

  useEffect(() => {
    if (props.user) {
      axios.get(BASE_URL + '/api/users', {
        params: {
          user_id: props.user.user_id
        }
      })
      .then((data) => {
        setUser(data.data.users[0]);
      })
    }
  }, [props.user])

  return (
    <DialogTemplate
      handleClose = {props.handleProfileClose}
      open = {props.profileOpen}
      content = {
        <Box id="popup__main__box">
          <Box className="popup__profile__header">
            <Avatar
              src={user.user_profile_image_url}
              className={classes.popup__profile__avatar}
            />
            <Typography variant="h6" color="primary" style={{ marginTop: 10 }}>
              <b>{user.name}</b>
            </Typography>
            <Typography variant="subtitle2">
              {user.gender}
            </Typography>
            <Typography variant="subtitle2">
              {user.region}, {user.country}
            </Typography>
          </Box>
          <br/>
          <Box id="popup__profile__section">
            <Typography variant="subtitle1">
              <b>Fitness Interests:</b> {user.fitness_interests}
            </Typography>
            <br/>
            <Typography variant="subtitle1">
              <b>Fitness Goals:</b> {user.fitness_goals}
            </Typography>
            <br/>
            <Typography variant="subtitle1">
              <b>Achievements:</b>
            </Typography>
            <Box className="popup__profile__emojis">
              {user.one_completed_badge && (
                <div>
                  <Paper 
                    elevation={4}
                    aria-owns={open ? "mouse-over-popover" : undefined}
                    aria-haspopup="true"
                    onMouseEnter={handlePopoverOpen} 
                    onMouseLeave={handlePopoverClose} 
                    className="popup__emoji"
                  >
                    &#127895;
                  </Paper>
                  <Popover
                    className={classes.popover}
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    onClose={handlePopoverClose}
                  >
                    <Typography variant="subtitle1" className="popup__acheivement_badge">Completed first workout!</Typography>
                  </Popover>
                </div>
              )}
              {user.ten_completed_badge && (
                <div>
                  <Paper 
                    elevation={4}
                    aria-owns={open ? "mouse-over-popover" : undefined}
                    aria-haspopup="true"
                    onMouseEnter={handlePopoverOpen} 
                    onMouseLeave={handlePopoverClose} 
                    className="popup__emoji"
                  >
                    &#127941;
                  </Paper>
                  <Popover
                    className={classes.popover}
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    onClose={handlePopoverClose}
                  >
                    <Typography variant="subtitle1" className="popup__acheivement_badge">Completed 10 workouts!</Typography>
                  </Popover>
                </div>
              )}
            </Box>
            <br/>
            <Typography variant="subtitle1">
              <b>Completed Sessions:</b> {user.completed_sessions}
            </Typography>
            <br/>
            <Typography variant="subtitle1">
              <b>Completion Rate:</b> {Math.round(user.completion_rate * 100)}%
            </Typography>
            <br/>
            <Typography variant="subtitle1">
              <b>Avg Session Length:</b> {Math.round(user.avg_session_length, 2)} minutes
            </Typography>
          </Box>
        </Box>
      }
    />
  )
}
