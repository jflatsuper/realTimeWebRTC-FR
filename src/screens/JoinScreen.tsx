import React, {FC} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import RTCPeerConnection from 'react-native-webrtc/lib/typescript/RTCPeerConnection';
import {Socket} from 'socket.io-client';
import TextInputContainer from '../common/TextInputContainer';
type Props = {
  peerConnection: React.MutableRefObject<RTCPeerConnection>;
  socket: Socket;
  otherUserId: any;
  callerId: string;
  setType: any;
};
const JoinScreen: FC<Props> = ({
  setType,
  socket,
  peerConnection,
  otherUserId,
  callerId,
}) => {
  function sendCall(data: any) {
    socket.emit('makeCall', data);
  }
  async function processCall() {
    const sendChannel = peerConnection.current.createDataChannel('sendChannel');
    sendChannel.onopen = e => console.log('open!!!!');
    const sessionDescription = await peerConnection.current.createOffer({});
    console.log(sessionDescription, 'sessionDescription');
    await peerConnection.current.setLocalDescription(sessionDescription);
    sendCall({
      calleeId: otherUserId.current,
      rtcMessage: sessionDescription,
    });
  }
  const handleChange = (text: string) => {
    otherUserId.current = text;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.baseContainer}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <View style={styles.callerView}>
            <Text style={styles.callerText}>Your Caller ID</Text>
            <View style={styles.callerIdView}>
              <Text style={styles.callerIdText}>{callerId}</Text>
            </View>
          </View>

          <View style={styles.entryContainer}>
            <Text style={styles.entryLabel}>Enter call id of another user</Text>
            <TextInputContainer
              placeholder={'Enter Caller ID'}
              value={otherUserId.current}
              setValue={handleChange}
              keyboardType={'number-pad'}
            />
            <TouchableOpacity
              onPress={() => {
                setType('OUTGOING_CALL');
                processCall();
              }}
              style={styles.entryButton}>
              <Text style={styles.entryButtonText}>Call Now</Text>
            </TouchableOpacity>
          </View>
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  baseContainer: {
    flex: 1,
    backgroundColor: '#050A0E',
    justifyContent: 'center',
    paddingHorizontal: 42,
  },
  callerView: {
    padding: 35,
    backgroundColor: '#1A1C22',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  callerText: {
    fontSize: 18,
    color: '#D0D4DD',
  },
  callerIdView: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
  },
  callerIdText: {
    fontSize: 32,
    color: '#ffff',
    letterSpacing: 6,
  },
  entryContainer: {
    backgroundColor: '#1A1C22',
    padding: 40,
    marginTop: 25,
    justifyContent: 'center',
    borderRadius: 14,
  },
  entryLabel: {
    fontSize: 18,
    color: '#D0D4DD',
  },
  entryButton: {
    height: 50,
    backgroundColor: '#5568FE',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 16,
  },
  entryButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});
export default JoinScreen;
