import React, { useEffect, useState } from "react";
import AV from './AV';

import { Button, ButtonGroup, IconButton } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import VolumeMuteIcon from '@material-ui/icons/VolumeMute';
import SettingsIcon from '@material-ui/icons/Settings';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import { set } from "lodash";

export default function Session(props) {

  const { roomName, room, endSession } = props;
  const [ participants, setParticipants] = useState([]);

  const [ sessionSettings, setSessionSettings ] = useState({
    'audio': true,
    'video': true
  });

  useEffect(() => {
    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };

    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);
    room.participants.forEach(participantConnected);
    return () => {
      room.off("participantConnected", participantConnected);
      room.off("participantDisconnected", participantDisconnected);
    };
  }, [room]);

  const toggleVideo = function(room) {
    if (sessionSettings.video) {
      room.localParticipant.videoTracks.forEach(publication => {
        publication.track.disable();
      });
      setSessionSettings((prev) => {return {...prev, video: false}});
      console.log(sessionSettings);
      console.log(room);
    } else {
      room.localParticipant.videoTracks.forEach(publication => {
        publication.track.enable();
      });
      setSessionSettings((prev) => {return {...prev, video: true}});
      console.log(sessionSettings);
      console.log(room);

    }
  };

  const toggleAudio = function(room) {
    if (sessionSettings.audio) {
      room.localParticipant.audioTracks.forEach(publication => {
        publication.track.disable();
      });
      setSessionSettings((prev) => {return {...prev, audio: false}});
      console.log(sessionSettings);
      console.log(room);
    } else {
      room.localParticipant.audioTracks.forEach(publication => {
        publication.track.enable();
      });
      setSessionSettings((prev) => {return {...prev, audio: true}});
      console.log(sessionSettings);
      console.log(room);

    }
  };

  const remoteParticipants = participants.map((participant) => (
    <AV key={participant.sid} participant={participant} />
  ));

  const formatToMinutes = function(miliseconds) {
    const minutes = Math.floor(miliseconds / 1000 / 60);
    const seconds = Math.floor(miliseconds / 1000) - (minutes * 60);
    // return { minutes, seconds };
    return `${minutes} m ${seconds} s`;
  };

  const getCountDownEndpoint = function(distance) {
    const currentTime = new Date();
    return (currentTime.getTime() + distance);
  };

  
  const [ countDownTime, setCountDownTime ] = useState(30000);
  const [ countDownEndPoint, setCountDownEndpoint ] = useState(getCountDownEndpoint(30000));
  const [ workoutEnded, setWorkoutEnded ] = useState(false);
  
  const calcRemainingTime = function() {
    const currentTime = new Date();
    return (countDownEndPoint - currentTime.getTime());
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setCountDownTime(calcRemainingTime());
    }, 1000);

    if (countDownTime <= 0) {
      if (workoutEnded) {
        // workout has ended, and grace period has also ended. End session
        props.endSession()
      } else {
        // workout just ended, give grace period
        setCountDownTime(10000);
        setCountDownEndpoint(getCountDownEndpoint(10000));
        setWorkoutEnded(true);
      }
    }

    return () => clearTimeout(timer);
  });

  return (
    <div className="room">
      <div className="video-call-container">
        <div className="local-participant main-video">
          {room ? (
            <AV
              key={room.localParticipant.sid}
              participant={room.localParticipant}
            />
            
          ) : (
            ""
          )}
          <div class="video-controls">
            <div>
              <IconButton
                variant="contained"
                color="primary"
                size="large"
                onClick={() => {toggleVideo(room)}}
              >
              { sessionSettings.video && <VideocamIcon /> || <VideocamOffIcon /> }
              </IconButton>
              <IconButton
                variant="contained"
                color="primary"
                size="large"
                onClick={() => {toggleAudio(room)}}
              >
              { sessionSettings.audio && <VolumeUpIcon /> || <VolumeOffIcon /> }
              </IconButton>
              <IconButton
                variant="contained"
                color="primary"
                size="large"
              ><SettingsIcon />
              </IconButton>
            </div>
            <div>
              Time Remaining: {formatToMinutes(countDownTime)}
            </div>
            <div>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ExitToAppIcon />}
                size="large"
                onClick={props.endSession}
              >Finish
              </Button>
            </div>
          </div>
          <div class="video-controls">
            <div>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ThumbUpIcon />}
                size="large"
              >
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ThumbDownIcon />}
                size="large"
              >
              </Button>
            </div>
            <div>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CheckCircleOutlineIcon />}
                size="large"
              >
                Partner's Goal Completed
              </Button>
            </div>
            <div>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleOutlineIcon />}
                size="large"
              >
                Extend
              </Button>
            </div>
          </div>
        </div>
        <div className="remote-participants side-video">{remoteParticipants}</div>
      </div>
    </div>
  );
};