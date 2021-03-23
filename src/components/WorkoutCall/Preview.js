import { useState, useRef, useEffect } from 'react';
import Video from 'twilio-video';


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

  return (
    <div className="participant">
      <h3>{participant.identity}</h3>
      <video ref={videoRef} autoPlay={true} />
      <audio ref={audioRef} autoPlay={true} muted={true} />
    </div>
  );
};