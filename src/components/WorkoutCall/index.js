import { useState, useCallback, useEffect } from 'react';
import Session from './Session';
import Video from 'twilio-video';
import Preview from './Preview';
import './WorkoutCall.scss';
import { Link } from 'react-router-dom'
import axios from 'axios';

import { useLocation } from 'react-router-dom';

import { Button, ButtonGroup, IconButton } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';

// generate token here, no need for external route
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

export default function WorkoutCall(props) {

  // console.log('props', props.user.user_id);

  const REACT_APP_TWILIO_ACCOUNT_SID = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
  const REACT_APP_TWILIO_API_KEY_SID = process.env.REACT_APP_TWILIO_API_KEY;
  const REACT_APP_TWILIO_API_KEY_SECRET = process.env.REACT_APP_TWILIO_API_SECRET;
  const SESSION_UUID = useLocation().pathname.split('/')[2];

  const [username, setUsername] = useState(Math.random().toString());
  const [roomName, setRoomName] = useState("testRoom2");
  const [room, setRoom] = useState(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8081/api/sessions/" + SESSION_UUID)
      .then((result) => {
        const retrievedData = result.data[0];
        const sessionInfo = {
          uuid: retrievedData.session_uuid,
          time: retrievedData.scheduled_at,
          type: retrievedData.type,
          participants: {}
        }

        for (const participantString of retrievedData.participants) {
          // participant info starts as a string, convert it into an array
          const participant = participantString.split(' ');
          /*
            sample participantString -> 1 0ea9b155-daba-4fda-8539-3f4976d50c5b Martguerita Streetfield https://i.pravatar.cc/300?img=1
            participant[0] -> ID
            participant[1] -> UUID
            participant[2] -> first name
            participant[3] -> last name
            participant[4] -> profile image URL
          */
          sessionInfo.participants[participant[0]] = {
            uuid: participant[1],
            firstName: participant[2],
            lastName: participant[3],
            profileImage: participant[4]
          }
        }
        console.log(sessionInfo);
        if (!sessionInfo.participants[props.user.user_id]) {
          // user is not part of this session
        } else {
          setRoomName(retrievedData.uuid);
          setUsername(retrievedData.participants[props.user.user_id].uuid);
          console.log('states:', roomName, username);
        }

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
      <div className="video-call-container">
        <h1>Joining Session</h1>
        <p>
          Getting ready to join a workout session with...
        </p>
        <Preview participant={fakeLocalParticipant}/>

        <div className="video-controls">
          <div>
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
          <div>
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
        </div>
      </div>
    );
  }
};