import { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/EditOutlined';
import EditProfileDialog from 'components/Dialogs/EditProfileDialog';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
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
  
  // Do not render if there is no logged in user
  if (!props.user.user_id) return null;

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
                  <b>Achievements</b>
                </Typography>
                <br/>
                <Box className="profile__emojis">
                  {props.user.one_completed_badge && (
                    <div>
                      <Paper 
                        elevation={4}
                        aria-owns={open ? "mouse-over-popover" : undefined}
                        aria-haspopup="true"
                        onMouseEnter={handlePopoverOpen} 
                        onMouseLeave={handlePopoverClose} 
                        className="emoji"
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
                        <Typography variant="subtitle1" className="acheivement_badge">Completed first workout!</Typography>
                      </Popover>
                    </div>
                  )}
                  {props.user.ten_completed_badge && (
                    <div>
                      <Paper 
                        elevation={4}
                        aria-owns={open2 ? "mouse-over-popover" : undefined}
                        aria-haspopup="true"
                        onMouseEnter={handlePopoverOpen2} 
                        onMouseLeave={handlePopoverClose2} 
                        className="emoji"
                      >
                        &#127941;
                      </Paper>
                      <Popover
                        className={classes.popover}
                        open={open2}
                        anchorEl={anchorEl2}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                        onClose={handlePopoverClose2}
                      >
                        <Typography variant="subtitle1" className="acheivement_badge">Completed 10 workouts!</Typography>
                      </Popover>
                    </div>
                  )}
                  {false && (<Paper elevation={4} className="emoji">&#127942;</Paper>)}
                  {false && (<Paper elevation={4} className="emoji">&#128293;</Paper>)}
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