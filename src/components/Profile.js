import { useState, useEffect } from 'react';
import { Grid, Box, Container, Typography, Paper, IconButton, Popover } from '@material-ui/core';
import EditIcon from '@material-ui/icons/EditOutlined';
import { makeStyles } from '@material-ui/core/styles';
import EditProfileDialog from 'components/Dialogs/EditProfileDialog';
import "./Profile.scss";

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none',
  }
}));

export default function Profile(props) {

  const classes = useStyles();
  
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const handleProfileEditClick = () => {
    setProfileEditOpen(true);
  }
  const handleProfileEditClose = () => {
    setProfileEditOpen(false);
  }

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
  
  // Do not render if there is no logged in user
  if (!props.user.user_id) return null;

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

  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%">
      <Grid container className="profile__grid">
        <Grid item xs={3} className="profile__margin">
          <Box />
        </Grid>
        <Grid item xs={6} className="profile__center">
          <Box className="profile__center__header">
            <div id="profile__avatar">
              <img src={props.user.user_profile_image_url} />
            </div>
            <IconButton id="profile__avatar__edit">
              <EditIcon />
            </IconButton>
          </Box>
          <Box className="profile__center__body">
            <Container className="profile__center_content">
              <br/>
              <Typography variant="h5" id="profile__name">
                <b>{props.user.name}</b>
              </Typography>
              <br/><br/>
              <Box className="profile__section">
                <Typography variant="h6" className="profile__heading">
                  <b>My Profile</b>
                  <IconButton onClick={handleProfileEditClick}>
                    <EditIcon 
                      style={{ fontSize: 18 }}
                    />
                  </IconButton>
                  <EditProfileDialog
                    handleProfileEditClose={handleProfileEditClose}
                    profileEditOpen={profileEditOpen}
                    user={props.user}
                    setUser={props.setUser}
                  />
                </Typography>
                <br/>
                <Typography variant="subtitle1">
                  Location: {props.user.region}, {props.user.country}
                </Typography>
                <br/>
                <Typography variant="subtitle1">
                  Timezone: {props.user.timezone}
                </Typography>
                <br/>
                <Typography variant="subtitle1">
                  Fitness Interests: {props.user.fitness_interests}
                </Typography>
                <br/>
                <Typography variant="subtitle1">
                  Fitness Goals: {props.user.fitness_goals}
                </Typography>
                <br/>
              </Box>
              <br/><br/>
              <Box className="profile__section">
                <Typography variant="h6" className="profile__heading">
                  <b>Notifications</b>
                  <IconButton>
                    <EditIcon 
                      style={{ fontSize: 18 }}
                    />
                  </IconButton>
                </Typography>
                <br/>
                <Typography variant="subtitle1">
                  Email: when session booked, when matched
                </Typography>
                <br/>
                <Typography variant="subtitle1">
                  SMS: none
                </Typography>
                <br/>
              </Box>
              <br/><br/>
              <Box className="profile__section">
                <Typography variant="h6" className="profile__heading">
                  <b>Achievements</b>
                </Typography>
                <br/>
                <Box className="profile__emojis">
                  {achievement_badges.map(badge => (
                    props.user[badge.badge_name] && (
                      <div>
                        <Paper 
                          elevation={4}
                          onMouseEnter={(e) => handlePopoverOpen(e, badge.id)} 
                          onMouseLeave={handlePopoverClose} 
                          className="emoji"
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
                          <Typography variant="subtitle1" className="acheivement_badge">{badge.hover_text}</Typography>
                        </Popover>
                      </div>
                    )
                  ))}
                </Box>
                <br/>
              </Box>
              <br/><br/>
              <Box className="profile__section">
                <Typography variant="h6" className="profile__heading">
                  <b>Stats</b>
                </Typography>
                <br/>
                <Typography variant="subtitle1">
                  Completed Sessions: {props.user.completed_sessions}
                </Typography>
                <br/>
                <Typography variant="subtitle1">
                  Completion Rate: {Math.round(props.user.completion_rate * 100)}%
                </Typography>
                <br/>
                <Typography variant="subtitle1">
                  Avg Session Length: {Math.round(props.user.avg_session_length, 2)} minutes
                </Typography>
              </Box>
            </Container>
          </Box>
        </Grid>
        <Grid item xs={3} className="profile__margin">
          <Box />
        </Grid>
      </Grid>
    </Box>
  )
}