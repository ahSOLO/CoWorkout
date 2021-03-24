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

  const [popoverState, setPopoverState] = useState({
    anchorEl: null,
    openedPopoverId: null
  })
  const handlePopoverOpen = (event, popoverId) => {
    setPopoverState({
      anchorEl: event.currentTarget,
      openedPopoverId: popoverId
    });
  };
  const handlePopoverClose = () => {
    setPopoverState({
      anchorEl: null,
      openedPopoverId: null
    });
  };

  const { anchorEl, openedPopoverId } = popoverState;
  
  const achievement_badges = [
    {
      id: 0,
      badge_name: 'one_completed_badge',
      emoji: '127895',
      hover_text: 'Completed first workout!'
    },
    {
      id: 1,
      badge_name: 'ten_completed_badge',
      emoji: '127941',
      hover_text: 'Completed 10 workouts!'
    }
  ]

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
              {achievement_badges.map(badge => (
                user[badge.badge_name] && (
                  <div>
                    <Paper 
                      elevation={4}
                      onMouseEnter={(e) => handlePopoverOpen(e, badge.id)} 
                      onMouseLeave={handlePopoverClose} 
                      className="popup__emoji"
                    >
                      {String.fromCodePoint(parseInt (badge.emoji, 10))}
                    </Paper>
                    <Popover
                      className={classes.popover}
                      open={openedPopoverId === badge.id}
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                    >
                      <Typography variant="subtitle1" className="popup__acheivement_badge">{badge.hover_text}</Typography>
                    </Popover>
                  </div>
                )
              ))}
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
