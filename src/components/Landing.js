import { useHistory } from 'react-router-dom';
import {useState, useEffect} from 'react';
import { Button, Box, Typography, Container, Grid, Fade, Slide } from '@material-ui/core';
import landing_img from "media/landing_img.jpg";
import landing_img2 from "media/landing_img2.jpg";
import "./Landing.scss";
import IntroVideoDialog from "components/Dialogs/IntroVideoDialog";

export default function Landing(props) {
  const history = useHistory();
  const [videoOpen, setVideoOpen] = useState(false);
  const [fade, setFade] = useState(0);

  useEffect(() => {
    const fadeTimer = setInterval(() => {
      setFade(prev => prev + 1);
    }, 1000);
    return () => {
      clearInterval(fadeTimer);
    }
  }, [])

  return (
    <Container id="landing-container">
      <IntroVideoDialog open={videoOpen} handleClose={() => setVideoOpen(false)}/>
      <Grid id="top-grid" container direction="row" justify="space-around" alignItems="center" spacing={5}>
        <Grid item sm={12} md={6}>
          <Box display="flex" flexDirection="column" justifyContent="space-around">
            <Fade in={(fade > 0)} timeout={1000}>
              <Typography variant="h2">
                Add motivation and accountability to your workouts
              </Typography>
            </Fade>
            <br/>
            <Fade in={(fade > 1)} timeout={1000}>  
              <Typography variant="h6">
                CoWorkout is an online community that helps you stick to your fitness goals and keep you motivated through peer-to-peer video matchmaking.
              </Typography>
            </Fade>
            <br/>
            <Fade in={(fade > 2)} timeout={1000}>
              <Box display="flex" justifyContent="space-between" width="85%">
                <Button color="primary" size="large" variant="outlined" onClick={() => history.push("/register")}><b>Try CoWorkout</b></Button>
                <Button color="primary" size="large" variant="outlined" onClick={() => setVideoOpen(true)}><b>See CoWorkout in Action</b></Button>
              </Box>
            </Fade>
          </Box>
        </Grid>
        <Grid container sm={12} md={6} direction="column" justify="center" alignItems="center">
          <Slide in={true} direction={"left"} timeout={800}>
            <img id="landing-img" src={landing_img2}></img>
          </Slide>
        </Grid>
      </Grid>

      <Grid id="mid-grid=1" container direction="row" justify="space-around" spacing={5}>
        <Grid item sm={12} md={6}>
          <Box display="flex" flexDirection="column" justifyContent="flex-start">
            <Typography variant="h4">
              What is CoWorkout?
            </Typography>
            <br/>
            <Typography variant="body1">
              CoWorkout is a pairing service which matches individuals from around the world into online fitness sessions over video-calls. You can get started with three easy steps:
            </Typography>
            <br/>
            <Typography variant="body1">
              1. Schedule a time: sessions are 30 minutes long.
            </Typography>
            <Typography variant="body1">
              2. Set your goal: set your intentions for the exercises you want to complete, such as the sets and reps you want to perform during the session.
            </Typography>
            <Typography variant="body1">
              3. Crush your CoWorkout: have a great workout, show up on time, be motivating and kind to your partner!
            </Typography>
          </Box>
        </Grid>
        <Grid item sm={12} md={6}>
          <Box display="flex" flexDirection="column" justifyContent="flex-start">
            <Typography variant="h4">
              Why is CoWorkout better?
            </Typography>
            <br/>
            <Typography variant="body1">
              CoWorkout improves your exercises through five proven methods:
            </Typography>
            <br/>
            <Typography variant="body1">
              1. <b>Goal setting</b> ahead of the session improves your chances of success.
            </Typography>
            <Typography variant="body1">
              2. <b>Accountability</b> to meet your goals for both participants in each fitness session.
            </Typography>
            <Typography variant="body1">
              3. <b>Encouragement</b> offered by your fitness partner.
            </Typography>
            <Typography variant="body1">
              4. <b>Structure</b> is created by a predetermined, blocked off time.
            </Typography>
            <Typography variant="body1">
              5. <b>Productivity</b> is enabled by jumping straight into the workout.
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid id="mid-grid-2" container direction="column" alignItems="center" spacing={5}>
        <Grid item sm={12} md={6}>
          <Box display="flex" flexDirection="column" justifyContent="flex-start">
            <Typography variant="h4">
              Frequently Asked Questions
            </Typography>
            <br/>
            <Typography variant="body1" color="primary">
              <b>What if I'm a beginner?</b>
            </Typography>
            <Typography variant="body1">
              No problem! Our program is adaptable for all fitness levels.
            </Typography>
            <br/>
            <Typography variant="body1" color="primary">
              <b>Who will I get matched with?</b>
            </Typography>
            <Typography variant="body1">
              Real people who are also looking to stay accountable to their workouts like you!
            </Typography>
            <br/>
            <Typography variant="body1" color="primary">
              <b>What equipment do I need?</b>
            </Typography>
            <Typography variant="body1">
              All you need is a camera, an internet connection, and your fitness equipment. There is no need to download an app! You can do your sessions anywhere through your web browser.
            </Typography>
            <br/>
            <Typography variant="body1" color="primary">
              <b>What are the costs?</b>
            </Typography>
            <Typography variant="body1">
              During our trial period, CoWorkout is completely free!
            </Typography>
            <br/>
            <Typography variant="body1" color="primary">
              <b>What type of behavior is acceptable?</b>
            </Typography>
            <Typography variant="body1">
              We strictly adhere to a policy of no harassment, discriminatory behavior, or inappropriate comments. Offenders are permanently banned.
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid id="bot-grid" container direction="row" justify="space-around" alignItems="center" spacing={10}>
        <Grid container sm={12} md={6} direction="column" justify="center" alignItems="center">
          <img id="landing-img" src={landing_img}></img>
        </Grid>
        <Grid item sm={12} md={6}>
          <Box display="flex" flexDirection="column" justifyContent="space-around">
            <Typography variant="h4">
              Get serious about your fitness goals and make them a habit!
            </Typography>
            <br/>
            <Typography variant="h6">
              Finding an exercise accountability partner has never been easier.
            </Typography>
            <br/>
            <Box display="flex" >
              <Button color="primary" size="large" variant="outlined" onClick={() => history.push("/register")}><b>Get Started</b></Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <br/>
    </Container>
  )
}