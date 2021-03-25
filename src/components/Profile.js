import { useState, useEffect } from 'react';
import { Grid, Box, Container, Typography, Paper, IconButton, Popover, Avatar } from '@material-ui/core';
import EditIcon from '@material-ui/icons/EditOutlined';
import { makeStyles } from '@material-ui/core/styles';
import EditProfileDialog from 'components/Dialogs/EditProfileDialog';
import EditNotificationDialog from 'components/Dialogs/EditNotificationDialog';
import "./Profile.scss";
import { achievement_badges } from "helpers/achievement_badges";

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

  const [notificationEditOpen, setNotificationEditOpen] = useState(false);
  const handleNotificationEditClick = () => {
    setNotificationEditOpen(true);
  }
  const handleNotificationEditClose = () => {
    setNotificationEditOpen(false);
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

  return (
    <Box display="flex" flexDirection="column" justifyContent="flex-start" height="100%" width="100%" id="profile-main-container">
        
      <br/><br/><br/>

      <Paper className="profile-paper">
        <Box className="profile-header-background">
          <div id="profile-avatar-container">
            <Avatar id="profile-avatar" src={props.user.user_profile_image_url} />
          </div>
        </Box>
        <Box className="profile-header-main">
          <Typography variant="h5" id="profile-name">
            <b>{props.user.name}</b>
          </Typography>
          <Box className="profile-emojis">
            {achievement_badges.map(badge => (
              props.user[badge.badge_name] && (
                <div>
                  <Paper 
                    variant="outlined"
                    onMouseEnter={(e) => handlePopoverOpen(e, badge.id)} 
                    onMouseLeave={handlePopoverClose} 
                    className="emoji"
                  >
                    <img src={badge.emoji} className="emoji-image"/>
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
                    <Typography variant="subtitle1" className="acheivement-badge">{badge.hover_text}</Typography>
                  </Popover>
                </div>
              )
            ))}
          </Box>
        </Box>
      </Paper>

      <br/><br/>

      <Paper className="profile-paper">
        <Box className="profile-section">
          <Typography variant="h6" className="profile-heading">
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
            <b>Location:</b> {props.user.region}, {props.user.country}
          </Typography>
          <br/>
          <Typography variant="subtitle1">
            <b>Timezone:</b> {props.user.timezone}
          </Typography>
          <br/>
          <Typography variant="subtitle1">
            <b>Fitness Interests:</b> {props.user.fitness_interests}
          </Typography>
          <br/>
          <Typography variant="subtitle1">
            <b>Fitness Goals:</b> {props.user.fitness_goals}
          </Typography>
        </Box>
      </Paper>

      <br/><br/>

      <Paper className="profile-paper">
        <Box className="profile-section">
          <Typography variant="h6" className="profile-heading">
            <b>Notifications</b>
            <IconButton onClick={handleNotificationEditClick}>
              <EditIcon 
                style={{ fontSize: 18 }}
              />
            </IconButton>
            <EditNotificationDialog
              handleNotificationEditClose={handleNotificationEditClose}
              notificationEditOpen={notificationEditOpen}
            />
          </Typography>
          <br/>
          <Typography variant="subtitle1">
            <b>Email:</b> when session booked, when matched
          </Typography>
          <br/>
          <Typography variant="subtitle1">
            <b>SMS:</b> none
          </Typography>
        </Box>
      </Paper>

      <br/><br/>

      <Paper className="profile-paper">
        <Box className="profile-section">
          <Typography variant="h6" className="profile-heading">
            <b>Stats</b>
          </Typography>
          <br/>
          <Typography variant="subtitle1">
            <b>Completed Sessions:</b> {props.user.completed_sessions}
          </Typography>
          <br/>
          <Typography variant="subtitle1">
            <b>Completion Rate:</b> {Math.round(props.user.completion_rate * 100)}%
          </Typography>
          <br/>
          <Typography variant="subtitle1">
            <b>Avg Session Length:</b> {Math.round(props.user.avg_session_length, 2)} minutes
          </Typography>
          <br/>
          <Typography variant="subtitle1">
            <b>Positive Rating:</b> {Math.round(props.user.rating_percentage * 100)}%
          </Typography>
        </Box>
      </Paper>

      <br/><br/><br/>

    </Box>
  )
}