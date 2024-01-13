import React, {useEffect, useRef, useState} from 'react';
import InCallManager from 'react-native-incall-manager';
import {
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  mediaDevices,
} from 'react-native-webrtc';
import SocketIOClient from 'socket.io-client';
import IncomingCallScreen from './src/screens/IncomingScreen';
import JoinScreen from './src/screens/JoinScreen';
import OutgoingCallScreen from './src/screens/OutgoingScreen';
import WebrtcRoomScreen from './src/screens/WebRTCScreen';

export default function App({}) {
  const [type, setType] = useState('JOIN');
  const localStream = useRef<MediaStream | null>(null);

  const remoteStream = useRef<MediaStream | null>(null);

  const [callerId] = useState(
    Math.floor(100000 + Math.random() * 900000).toString(),
  );
  const otherUserId = useRef(null);

  const socket = SocketIOClient('https://27cc-102-88-33-69.ngrok-free.app', {
    transports: ['websocket'],
    autoConnect: true,
    query: {
      callerId,
    },
  });

  const peerConnection = useRef(
    new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
        {
          urls: 'stun:stun1.l.google.com:19302',
        },
        {
          urls: 'stun:stun2.l.google.com:19302',
        },
      ],
    }),
  );

  let remoteRTCMessage = useRef<any>(null);

  useEffect(() => {
    socket.on('newCall', data => {
      remoteRTCMessage.current = data.rtcMessage;
      otherUserId.current = data.callerId;
      setType('INCOMING_CALL');
    });

    socket.on('callAnswered', data => {
      remoteRTCMessage.current = data.rtcMessage;
      peerConnection.current
        .setRemoteDescription(
          new RTCSessionDescription(remoteRTCMessage.current),
        )
        .catch(err => {
          console.log('UNable to joiin', err);
        });
      setType('WEBRTC_ROOM');
    });

    socket.on('ICEcandidate', data => {
      let message = data.rtcMessage;
      console.log('ICEcandidate', data);
      if (peerConnection.current) {
        peerConnection?.current
          .addIceCandidate(
            new RTCIceCandidate({
              candidate: message.candidate,
              sdpMid: message.id,
              sdpMLineIndex: message.label,
            }),
          )
          .then(() => {
            console.log('SUCCESS');
          })
          .catch(err => {
            console.log('Error', err);
          });
      }
    });

    let isFront = false;

    // mediaDevices.enumerateDevices().then((sourceInfos: any) => {
    //   let videoSourceId;
    //   for (let i = 0; i < sourceInfos.length; i++) {
    //     const sourceInfo = sourceInfos[i];
    //     if (
    //       sourceInfo.kind === 'videoinput' &&
    //       sourceInfo.facing === (isFront ? 'user' : 'environment')
    //     ) {
    //       videoSourceId = sourceInfo.deviceId;
    //     }
    //   }
    // });
    mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
        // {
        //   mandatory: {
        //     minWidth: 500, // Provide your own width, height and frame rate here
        //     minHeight: 300,
        //     minFrameRate: 30,
        //   },
        //   facingMode: isFront ? 'user' : 'environment',
        //   // optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
        // },
      })
      .then(stream => {
        // Got stream!
        localStream.current = stream;
        stream
          .getTracks()
          .forEach(track => peerConnection.current.addTrack(track, stream));
        // setup stream listening
      })
      .catch(error => {
        console.log('err', error);
        // Log error
      });
    console.log(peerConnection.current._remoteStreams, 'test');

    peerConnection.current.ontrack = event => {
      remoteStream.current = event.streams[0];
    };

    //Setup ice handling
    peerConnection.current.onicecandidate = event => {
      if (event.candidate) {
        sendICEcandidate({
          calleeId: otherUserId.current,
          rtcMessage: {
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
          },
        });
      } else {
        console.log('End of candidates.');
      }
    };

    return () => {
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
      }
      if (remoteStream.current) {
        remoteStream.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }

      socket.off('newCall');
      socket.off('callAnswered');
      socket.off('ICEcandidate');
    };
  }, []);

  useEffect(() => {
    InCallManager.start();
    InCallManager.setKeepScreenOn(true);
    InCallManager.setForceSpeakerphoneOn(true);

    return () => {
      InCallManager.stop();
    };
  }, []);

  function sendICEcandidate(data) {
    socket.emit('ICEcandidate', data);
  }

  switch (type) {
    case 'JOIN':
      return (
        <JoinScreen
          setType={setType}
          peerConnection={peerConnection}
          socket={socket}
          otherUserId={otherUserId}
          callerId={callerId}
        />
      );
    case 'INCOMING_CALL':
      return (
        <IncomingCallScreen
          setType={setType}
          peerConnection={peerConnection}
          socket={socket}
          otherUserId={otherUserId}
          remoteRTCMessage={remoteRTCMessage}
        />
      );
    case 'OUTGOING_CALL':
      return <OutgoingCallScreen setType={setType} otherUserId={otherUserId} />;
    case 'WEBRTC_ROOM':
      return (
        <WebrtcRoomScreen
          setType={setType}
          peerConnection={peerConnection}
          localStream={localStream}
          remoteStream={remoteStream}
          // setlocalStream={setlocalStream}
        />
      );
    default:
      return null;
  }
}
