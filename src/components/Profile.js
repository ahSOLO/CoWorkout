import Grid from '@material-ui/core/Grid';
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import EditIcon from '@material-ui/icons/EditOutlined';
import useApplicationData from 'hooks/useApplicationData';
import "./styles.scss";


export default function Profile(props) {
  
  const { user } = useApplicationData();
  
  return (
    <div>
      <Grid container className="profile__grid">
        <Grid item xs={2} className="profile__margin">
          <Box>
          </Box>
        </Grid>
        <Grid item xs={8} className="profile__center">
          <Box className="profile__center__header">
            <div id="profile__avatar">
              <img src={user.profile_image_url} />
            </div>
            <EditIcon id="profile__avatar__edit"/>
          </Box>
          <Box className="profile__center__body">
            <Container className="profile__center_content">
              <br/>
              <Typography variant="h5" id="profile__name">
                <b>{user.name}</b>
              </Typography>
              <br/><br/>
              <Box className="profile__section">
                <Typography variant="h6" className="profile__heading">
                  <b>My Profile</b>
                  <EditIcon style={{ fontSize: 18 }} className="profile__heading__edit"/>
                </Typography>
                <br/>
                <Typography variant="subtitle1">
                  Location: {user.region}, {user.country}
                </Typography>
                <br/>
                <Typography variant="subtitle1">
                  Timezone: {user.timezone}
                </Typography>
                <br/>
                <Typography variant="subtitle1">
                  Fitness Interests: {user.fitness_interests}
                </Typography>
                <br/>
                <Typography variant="subtitle1">
                  Fitness Goals: {user.fitness_goals}
                </Typography>
                <br/>
              </Box>
              <br/><br/>
              <Box className="profile__section">
                <Typography variant="h6" className="profile__heading">
                  <b>Achievements</b>
                  <EditIcon style={{ fontSize: 18 }} className="profile__heading__edit"/>
                </Typography>
                <br/>
                <Box className="profile__emojis">
                  {user.one_completed_badge && (<Paper elevation={4} className="emoji">&#127895;</Paper>)}
                  {user.ten_completed_badge && (<Paper elevation={4} className="emoji">&#127941;</Paper>)}
                  {false && (<Paper elevation={4} className="emoji">&#127942;</Paper>)}
                  {false && (<Paper elevation={4} className="emoji">&#128293;</Paper>)}
                </Box>
                <br/>
              </Box>
              <br/><br/>
              <Box className="profile__section">
                <Typography variant="h6" className="profile__heading">
                  <b>Stats</b>
                  <EditIcon style={{ fontSize: 18 }} className="profile__heading__edit"/>
                </Typography>
                <br/>
                <Typography variant="subtitle1">
                  Completed Sessions: {user.completed_sessions}
                </Typography>
                <br/>
                <Typography variant="subtitle1">
                  Completion Rate: {Math.round(user.completion_rate * 100)}%
                </Typography>
                <br/>
                <Typography variant="subtitle1">
                  Avg Session Length: {Math.round(user.avg_session_length, 2)} minutes
                </Typography>
              </Box>
            </Container>
          </Box>
        </Grid>
        <Grid item xs={2} className="profile__margin">
          <Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  )
}