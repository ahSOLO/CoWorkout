import { useState, useRef, useEffect } from 'react';
import Video from 'twilio-video';
import { Link } from 'react-router-dom'
import { Button, ButtonGroup, IconButton, Box, Typography } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';

export default function Preview(props) {
  const { participant } = props;

  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);

  const videoRef = useRef();
  const audioRef = useRef();

  useEffect(() => {
    Video.createLocalAudioTrack()
      .then((track) => {
        setAudioTracks(prev => [track]);
      });
    
    Video.createLocalVideoTrack()
      .then((track) => {
        setVideoTracks(prev => [track]);
      })
  }, [])

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  const disengagePreview = function() {
    videoTracks.forEach((track) => {
      track.stop()
    });
    audioTracks.forEach((track) => {
      track.stop()
    });
  };

  return (
    <>
      <div className="participant">
        <Typography variant="h5">{participant.identity}</Typography>
        <video ref={videoRef} autoPlay={true} />
        <audio ref={audioRef} autoPlay={true} muted={true} />
      </div>
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
            onClick={(event) => {
              disengagePreview();
              props.connect(event, props.username, props.roomName)
            }}
          >
            Ready
          </Button>
        </div>
        <div className="button-spacing">
          <Button
            onClick={disengagePreview}
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
    </>
  );
};