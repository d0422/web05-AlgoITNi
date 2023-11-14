import { useEffect, useState } from 'react';

export default function useMedia() {
  const [userVideo, setUserVideo] = useState<MediaStream>();
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
        setUserVideo(stream);
      });

    navigator.mediaDevices.enumerateDevices().then((res) => {
      setCameraList(res.filter((mediaDevice) => mediaDevice.kind === 'videoinput'));
      setMicList(res.filter((mediaDevice) => mediaDevice.kind === 'audioinput'));
      setSpeakerList(res.filter((mediaDevice) => mediaDevice.kind === 'audiooutput'));
    });
  }, [selectedCamera, selectedMic, selectedSpeaker]);

  return {
    stream: userVideo,
    camera: { list: cameraList, setCamera: setSelectedCamera },
    mic: { list: micList, setMic: setSelectedMic },
    speaker: { list: speakerList, setSpeaker: setSelectedSpeaker },
  };
}
