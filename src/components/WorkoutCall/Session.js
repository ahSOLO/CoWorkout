import React, { useEffect, useState } from "react";
import AV from './AV';

import { Button, ButtonGroup, IconButton } from '@material-ui/core';
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

export default function Session(props) {

  const DEFAULT_SESSION_DURATION = 1800000;
  const DEFAULT_GRACE_DURATION = 60000;

  const { roomName, room, endSession } = props;
  const [ participants, setParticipants] = useState([]);

  const [ sessionFeedback, setSessionFeedback ] = useState({
    partnerRating: 1,
    partnerCompletion: 1 // partner's completion is set to 1, so they don't get penalized for having the other person disconnect
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
              { workoutEnded && "Session Ending in " || "Workout Time Remaining" }: {formatToMinutes(countDownTime)}
            </div>
            <div>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ExitToAppIcon />}
                size="large"
                onClick={fastForwardCountDown}
              >
              { workoutEnded && "Exit" || "End Workout" }
              </Button>
            </div>
          </div>
          <div className={"video-controls" + (!workoutEnded && " hidden" || "")}>
            <div>
              <Button
                variant="contained"
                color={ sessionFeedback.partnerRating && "secondary" || "primary"}
                startIcon={<ThumbUpIcon />}
                size="large"
                onClick={() => {setSessionFeedback((prev) => { return {...prev, partnerRating: 1} })}}
              >
              </Button>
              <Button
                variant="contained"
                color={ sessionFeedback.partnerRating && "primary" || "secondary"}
                startIcon={<ThumbDownIcon />}
                size="large"
                onClick={() => (setSessionFeedback((prev) => { return {...prev, partnerRating: 0} }))}
              >
              </Button>
            </div>
            <div>
              <Button
                variant="contained"
                color={ sessionFeedback.partnerCompletion && "primary" || "secondary" }
                startIcon={<CheckCircleOutlineIcon />}
                size="large"
                onClick={() => {setSessionFeedback((prev) => { 
                  if (prev.partnerCompletion) {
                    return {...prev, partnerCompletion: 0}
                  } else {
                    return {...prev, partnerCompletion: 1}
                  }
                })}}
              >
                { sessionFeedback.partnerCompletion && "Partner's Goal Complete" || "Partner's Goal Incomplete" }
              </Button>
            </div>
            <div>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleOutlineIcon />}
                size="large"
                onClick={extendSession}
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