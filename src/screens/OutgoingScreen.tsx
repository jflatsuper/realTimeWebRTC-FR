import React, {FC} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CallEnd from '../../asset/CallEnd';
type Props = {
  setType: any;
  otherUserId: any;
};
const OutgoingCallScreen: FC<Props> = ({setType, otherUserId}) => {
  return (
    <View style={styles.baseContainer}>
      <View style={styles.callContainer}>
        <Text style={styles.callText}>Calling to...</Text>

        <Text style={styles.otherText}>{otherUserId.current}</Text>
      </View>
      <View style={styles.joinGroup}>
        <TouchableOpacity
          onPress={() => {
            setType('JOIN');
            otherUserId.current = null;
          }}
          style={styles.callEndContainer}>
          <CallEnd width={50} height={12} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default OutgoingCallScreen;
const styles = StyleSheet.create({
  callEndContainer: {
    backgroundColor: '#FF5D5D',
    borderRadius: 30,
    height: 60,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  baseContainer: {
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: '#050A0E',
  },
  callContainer: {
    padding: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  callText: {
    fontSize: 16,
    color: '#D0D4DD',
  },
  otherText: {
    fontSize: 36,
    marginTop: 12,
    color: '#ffff',
    letterSpacing: 6,
  },
  joinGroup: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
