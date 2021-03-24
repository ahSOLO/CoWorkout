import { useState, useCallback, useEffect } from 'react';
import Session from './Session';
import Video from 'twilio-video';
import Preview from './Preview';
import './WorkoutCall.scss';
import { Link } from 'react-router-dom'
import axios from 'axios';

import { useLocation } from 'react-router-dom';

import { Button, ButtonGroup, IconButton, Box, Typography } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';

// generate token here, no need for external route
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

export default function WorkoutCall(props) {
  const REACT_APP_TWILIO_ACCOUNT_SID = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
  const REACT_APP_TWILIO_API_KEY_SID = process.env.REACT_APP_TWILIO_API_KEY;
  const REACT_APP_TWILIO_API_KEY_SECRET = process.env.REACT_APP_TWILIO_API_SECRET;
  const SESSION_UUID = useLocation().pathname.split('/')[2];

  const [username, setUsername] = useState(Math.random().toString());
  const [roomName, setRoomName] = useState("testRoom");
  const [room, setRoom] = useState(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8081/api/sessions/" + SESSION_UUID)
      .then((result) => {
        console.log('results:', result);
      })
  }, [])

  const connectToRoom = useCallback(
    async (event) => {
      event.preventDefault();
      setConnecting(true);
      const JWT = createJwt(username, roomName);
      Video.connect(JWT, {
        name: roomName,
        audio: true,
        video: { width: 300 }
      })
        .then((room) => {
          setConnecting(false);
          setRoom(room);
        })
        .catch((err) => {
          console.error(err);
          setConnecting(false);
        });
    },
    []
  );

  const endSession = useCallback((sessionFeedback) => {
    if (!sessionFeedback) {
      sessionFeedback = {
        partnerRating: 1,
        partnerCompletion: 1
      };
    }
    axios.post('http://localhost:8081/test', {
      params: {
        feedback: JSON.stringify(sessionFeedback)
      }
    });
    setRoom((prevRoom) => {
      if (prevRoom) {
        prevRoom.localParticipant.tracks.forEach((trackPub) => {
          trackPub.track.stop();
        });
        prevRoom.disconnect();
      }
      return null;
    });
  }, []);

  // create access token for user
  const createJwt = function(identity = 'testuser', roomName = 'testroom') {
    const token = new AccessToken(REACT_APP_TWILIO_ACCOUNT_SID, REACT_APP_TWILIO_API_KEY_SID, REACT_APP_TWILIO_API_KEY_SECRET, { ttl: 14400 });
    token.identity = identity;
    const videoGrant = new VideoGrant({ room: roomName });
    token.addGrant(videoGrant);
    console.log(`Generated token for ${identity} to join ${roomName}`);
    return token.toJwt();
  };

  useEffect(() => {
    if (room) {
      const tidyUp = (event) => {
        if (event.persisted) {
          return;
        }
        if (room) {
          endSession();
        }
      };
      window.addEventListener("pagehide", tidyUp);
      window.addEventListener("beforeunload", tidyUp);
      return () => {
        window.removeEventListener("pagehide", tidyUp);
        window.removeEventListener("beforeunload", tidyUp);
      };
    }
  }, [room, endSession]);

  if (room) {
    return (
      <Session roomName={roomName} room={room} endSession={endSession} />
    );
  } else {
    const fakeLocalParticipant = {
      'identity': 'Video Preview'
    }
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" >
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width="100%">
          <Typography variant="h4">Joining Session</Typography>
          <Typography variant="subtitle1">Getting ready to join a workout session with...</Typography>
        </Box>
        <Preview participant={fakeLocalParticipant}/>

        <Box display="flex" justifyContent="space-between" width="100%">
          <div className="button-spacing">
            <Button
              variant="contained"
              color="primary"
              startIcon={<SettingsIcon />}
              size="large"
            >
              Settings
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ExitToAppIcon />}
              size="large"
              onClick={(event) => {connectToRoom(event)}}
            >
              Ready
            </Button>
          </div>
          <div className="button-spacing">
            <Button
              component={Link}
              to="/dashboard"
              variant="contained"
              color="primary"
              startIcon={<ExitToAppIcon />}
              size="large"
            >
              Leave
            </Button>
          </div>
        </Box>
      </Box>
    );
  }
};