import React, {FC, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {RTCView} from 'react-native-webrtc';
import CallEnd from '../../asset/CallEnd';
import CameraSwitch from '../../asset/CameraSwitch';
import MicOff from '../../asset/MicOff';
import MicOn from '../../asset/MicOn';
import VideoOff from '../../asset/VideoOff';
import VideoOn from '../../asset/VideoOn';
import IconContainer from '../IconContainer';
type Props = {
  localStream: any;
  remoteStream: any;
  //   setlocalStream: any;
  setType: any;
  peerConnection: any;
};
const WebrtcRoomScreen: FC<Props> = ({
  localStream,
  remoteStream,
  //   setlocalStream,
  peerConnection,
  setType,
}) => {
  const [localMicOn, setlocalMicOn] = useState(true);

  const [localWebcamOn, setlocalWebcamOn] = useState(true);

  function toggleCamera() {
    localWebcamOn ? setlocalWebcamOn(false) : setlocalWebcamOn(true);
    localStream.current.getVideoTracks().forEach((track: any) => {
      localWebcamOn ? (track.enabled = false) : (track.enabled = true);
    });
  }
  function toggleMic() {
    localMicOn ? setlocalMicOn(false) : setlocalMicOn(true);
    localStream.current.getAudioTracks().forEach((track: any) => {
      localMicOn ? (track.enabled = false) : (track.enabled = true);
    });
  }
  function switchCamera() {
    localStream.current.getVideoTracks().forEach((track: any) => {
      track._switchCamera();
    });
  }
  function leave() {
    peerConnection.current.close();
    localStream.current = null;
    setType('JOIN');
  }
  return (
    <View style={styles.container}>
      {localStream?.current ? (
        <RTCView
          objectFit={'cover'}
          style={styles.localStream}
          streamURL={localStream?.current?.toURL()}
        />
      ) : null}
      {remoteStream?.current ? (
        <RTCView
          objectFit={'cover'}
          style={styles.remoteStream}
          streamURL={remoteStream?.current?.toURL()}
        />
      ) : null}
      <View style={styles.callEndContainer}>
        <IconContainer
          backgroundColor={'red'}
          onPress={() => {
            leave();
          }}
          Icon={<CallEnd height={26} width={26} fill="#FFF" />}
        />
        <IconContainer
          style={styles.micContainer}
          backgroundColor={!localMicOn ? '#fff' : 'transparent'}
          onPress={() => {
            toggleMic();
          }}
          Icon={
            localMicOn ? (
              <MicOn height={24} width={24} fill="#FFF" />
            ) : (
              <MicOff height={28} width={28} fill="#1D2939" />
            )
          }
        />
        <IconContainer
          style={styles.webCamContainer}
          backgroundColor={!localWebcamOn ? '#fff' : 'transparent'}
          onPress={() => {
            toggleCamera();
          }}
          Icon={
            localWebcamOn ? (
              <VideoOn height={24} width={24} fill="#FFF" />
            ) : (
              <VideoOff height={36} width={36} fill="#1D2939" />
            )
          }
        />
        <IconContainer
          style={styles.cameraSwitchContainer}
          backgroundColor={'transparent'}
          onPress={() => {
            switchCamera();
          }}
          Icon={<CameraSwitch height={24} width={24} fill="#FFF" />}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050A0E',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  localStream: {flex: 1, backgroundColor: '#050A0E'},
  remoteStream: {
    flex: 1,
    backgroundColor: '#050A0E',
    marginTop: 8,
  },
  callEndContainer: {
    marginVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  micContainer: {
    borderWidth: 1.5,
    borderColor: '#2B3034',
  },
  webCamContainer: {
    borderWidth: 1.5,
    borderColor: '#2B3034',
  },
  cameraSwitchContainer: {
    borderWidth: 1.5,
    borderColor: '#2B3034',
  },
});
export default WebrtcRoomScreen;
