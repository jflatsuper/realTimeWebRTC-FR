import React, {FC} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RTCPeerConnection, RTCSessionDescription} from 'react-native-webrtc';

import {Socket} from 'socket.io-client';
import CallAnswer from '../../asset/CallAnswer';
type Props = {
  setType: any;
  peerConnection: React.MutableRefObject<RTCPeerConnection>;
  socket: Socket;
  otherUserId: any;
  remoteRTCMessage: any;
};
const IncomingCallScreen: FC<Props> = ({
  setType,
  peerConnection,
  socket,
  otherUserId,
  remoteRTCMessage,
}) => {
  function answerCall(data: {
    callerId: string;
    rtcMessage: RTCSessionDescription;
  }) {
    socket.emit('answerCall', data);
  }

  async function processAccept() {
    console.log(remoteRTCMessage, 'remoteRTCMessage');
    peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(remoteRTCMessage.current),
    );
    const sessionDescription = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(sessionDescription);
    answerCall({
      callerId: otherUserId.current,
      rtcMessage: sessionDescription,
    });
  }
  return (
    <View style={styles.baseContainer}>
      <View style={styles.callView}>
        <Text style={styles.callText}>{otherUserId.current} is calling..</Text>
      </View>
      <View style={styles.answerGroup}>
        <TouchableOpacity
          onPress={() => {
            processAccept();
            setType('WEBRTC_ROOM');
          }}
          style={styles.answerCall}>
          <CallAnswer height={28} fill={'#fff'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  answerCall: {
    backgroundColor: 'green',
    borderRadius: 30,
    height: 60,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerGroup: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  baseContainer: {
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: '#050A0E',
  },
  callView: {
    padding: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  callText: {
    fontSize: 36,
    marginTop: 12,
    color: '#ffff',
  },
});
export default IncomingCallScreen;
