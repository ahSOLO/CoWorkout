import React, { useEffect, useState } from "react";
import AV from './AV';

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
        </div>
        <div className="remote-participants side-video">{remoteParticipants}</div>
      </div>
    </div>
  );
};