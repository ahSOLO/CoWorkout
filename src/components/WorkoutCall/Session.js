import React, { useEffect, useState } from "react";
import AV from './AV';

import GreenButton from 'components/Buttons/GreenButton';
import { Button, ButtonGroup, IconButton, Typography, Box } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';

import {Redirect} from 'react-router-dom';
import { set } from "lodash";
import { PersonPinCircleSharp } from "@material-ui/icons";

export default function Session(props) {
  useEffect(() => {
    console.log(props)
  }, []);

  const DEFAULT_SESSION_DURATION = 1800000;
  const DEFAULT_GRACE_DURATION = 90000;

  const { roomName, room, endSession } = props;
  const [ participants, setParticipants] = useState([]);

  const [ sessionFeedback, setSessionFeedback ] = useState({
    partnerRating: 1,
    partnerCompletion: 0,
    raterID: props.currentUserID,
    ratedID: props.partnerID
  });

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
  
  const [ countDownTime, setCountDownTime ] = useState(DEFAULT_SESSION_DURATION);
  const [ countDownEndPoint, setCountDownEndpoint ] = useState(getCountDownEndpoint(DEFAULT_SESSION_DURATION));
  const [ workoutEnded, setWorkoutEnded ] = useState(false);
  
  const calcRemainingTime = function() {
    const currentTime = new Date();
    return (countDownEndPoint - currentTime.getTime());
  }

  const fastForwardCountDown = function() {
    // ends workout if grace period has not started, ends grace period if workout has already ended
    setCountDownTime(0);
    setCountDownEndpoint(Date());
  };

  const extendSession = function() {
    setCountDownTime(DEFAULT_SESSION_DURATION);
    setCountDownEndpoint(getCountDownEndpoint(DEFAULT_SESSION_DURATION));
    setWorkoutEnded(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCountDownTime(calcRemainingTime());
    }, 1000);

    if (countDownTime <= 0) {
      if (workoutEnded) {
        // workout has ended, and grace period has also ended. End session
        props.endSession(sessionFeedback);
        return (<Redirect to="/dashboard" />)
      } else {
        // workout just ended, give grace period
        setCountDownTime(DEFAULT_GRACE_DURATION);
        setCountDownEndpoint(getCountDownEndpoint(DEFAULT_GRACE_DURATION));
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
          <div className="video-controls-container">
            <div className="video-controls">
              <Box minWidth="250px" justifyContent="flex-start">
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
              </Box>
              <Box display="flex" justifyContent="center" alignItems="center">
                <Typography variant="h6">
                  { workoutEnded && "Session Ending in " || "Workout Time Remaining" }: {formatToMinutes(countDownTime)}
                </Typography>
              </Box>
              <Box display="flex" minWidth="250px" justifyContent="flex-end" alignItems="center">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ExitToAppIcon />}
                  size="large"
                  onClick={fastForwardCountDown}
                >
                { workoutEnded && "Exit" || "Complete Workout" }
                </Button>
              </Box>
            </div>
            <div className={"video-controls" + (!workoutEnded && " hidden" || "")}>
              <Box minWidth="250px" display="flex" justifyContent="flex-start" alignItems="flex-end">
                <Box display="flex" flexDirection="column" justifyContent="flex-end" alignItems="center">
                  <Typography variant="body1">
                    Rate your Partner
                  </Typography>
                <Box display="flex" flexDirection="row" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    disableElevation={!sessionFeedback.partnerRating}
                    color={ sessionFeedback.partnerRating && "secondary" || "primary"}
                    startIcon={<ThumbDownIcon />}
                    size="large"
                    onClick={() => (setSessionFeedback((prev) => { return {...prev, partnerRating: 0} }))}
                  >
                  </Button>
                  <Button
                    variant="contained"
                    disableElevation={sessionFeedback.partnerRating}
                    color={ sessionFeedback.partnerRating && "primary" || "secondary"}
                    startIcon={<ThumbUpIcon />}
                    size="large"
                    onClick={() => {setSessionFeedback((prev) => { return {...prev, partnerRating: 1} })}}
                  >
                  </Button>
                </Box>
                </Box>
              </Box>
              <Box minWidth="250px" display="flex" justifyContent="center" alignItems="flex-end">
                { sessionFeedback.partnerCompletion && 
                  <GreenButton
                    variant="contained"
                    disableElevation={true}
                    startIcon={<CheckCircleOutlineIcon />}
                    size="large"
                    onClick={() => {setSessionFeedback((prev) => { 
                        return {...prev, partnerCompletion: 0}
                    })}}
                  >
                    Partner's Goal Completed
                  </GreenButton>
                ||
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => {setSessionFeedback((prev) => { 
                        return {...prev, partnerCompletion: 1}
                    })}}
                  >
                    Partner's Goal Complete?
                  </Button>
                }


              </Box>
              <Box minWidth="250px" display="flex" justifyContent="flex-end" alignItems="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddCircleOutlineIcon />}
                  size="large"
                  onClick={extendSession}
                >
                  Extend
                </Button>
              </Box>
            </div>
          </div>
        </div>
        <div className="remote-participants side-video">{remoteParticipants}</div>
      </div>
    </div>
  );
};