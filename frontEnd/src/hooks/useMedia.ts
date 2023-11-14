import { useEffect, useState } from 'react';

export default function useMedia() {
  const [userStream, setUserStream] = useState<MediaStream>();
  const [cameraList, setCameraList] = useState<MediaDeviceInfo[]>();
  const [micList, setMicList] = useState<MediaDeviceInfo[]>();
  const [speakerList, setSpeakerList] = useState<MediaDeviceInfo[]>();
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [selectedMic, setSelectedMic] = useState<string>('');
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>('');

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: selectedCamera ? { deviceId: { exact: selectedCamera } } : true,
        audio: selectedMic ? { deviceId: { exact: selectedMic } } : true,
      })
      .then((stream) => {
        setUserStream(stream);
      });

    navigator.mediaDevices.enumerateDevices().then((res) => {
      setCameraList(res.filter((mediaDevice) => mediaDevice.kind === 'videoinput'));
      setMicList(res.filter((mediaDevice) => mediaDevice.kind === 'audioinput'));
      setSpeakerList(res.filter((mediaDevice) => mediaDevice.kind === 'audiooutput'));
    });
  }, [selectedCamera, selectedMic, selectedSpeaker]);

  const offVideo = () => {
    userStream?.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    if (userStream) setUserStream({ ...userStream });
  };

  const muteMic = () => {
    userStream?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    if (userStream) setUserStream({ ...userStream });
  };

  return {
    stream: userStream,
    camera: { list: cameraList, setCamera: setSelectedCamera, offVideo },
    mic: { list: micList, setMic: setSelectedMic, muteMic },
    speaker: { list: speakerList, setSpeaker: setSelectedSpeaker },
  };
}
