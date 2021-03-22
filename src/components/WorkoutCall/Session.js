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

export default function Session(props) {

  const { roomName, room, endSession } = props;
  const [participants, setParticipants] = useState([]);

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

  const remoteParticipants = participants.map((participant) => (
    <AV key={participant.sid} participant={participant} />
  ));

  return (
    <div className="room">
      {/* <h2>Room: {roomName}</h2>
      <button onClick={endSession}>Leave Session</button> */}
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
              <Button
                variant="contained"
                color="primary"
                startIcon={<CameraAltIcon />}
                size="large"
              >Camera
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<VolumeMuteIcon />}
                size="large"
              >Mute<
                /Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SettingsIcon />}
                size="large"
              >Settings
              </Button>
            </div>
            <div>
              Time Remaining
            </div>
            <div>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ExitToAppIcon />}
                size="large"
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