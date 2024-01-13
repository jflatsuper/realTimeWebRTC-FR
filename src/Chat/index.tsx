// import React, {FC, Fragment, useEffect, useRef, useState} from 'react';
// import {ActivityIndicator, Text, View} from 'react-native';
// type Props = {
//   connection: any;
//   updateConnection: any;
//   channel: any;
//   updateChannel: any;
// };
// const Chat: FC<Props> = ({
//   connection,
//   updateConnection,
//   channel,
//   updateChannel,
// }) => {
//   const webSocket = useRef(null);
//   const [socketOpen, setSocketOpen] = useState(false);
//   const [socketMessages, setSocketMessages] = useState([]);
//   const [alert, setAlert] = useState(null);

//   useEffect(() => {
//     // add the websocket url to env in production environment
//     webSocket.current = new WebSocket('ws://localhost:9000');
//     webSocket.current.onmessage = message => {
//       const data = JSON.parse(message.data);
//       setSocketMessages(prev => [...prev, data]);
//     };
//     webSocket.current.onclose = () => {
//       webSocket.current.close();
//     };
//     return () => webSocket.current.close();
//   }, []);
//   const send = data => {
//     webSocket.current.send(JSON.stringify(data));
//   };
//   useEffect(() => {
//     let data = socketMessages.pop();
//     if (data) {
//       switch (data.type) {
//         case 'connect':
//           setSocketOpen(true);
//           break;
//         case 'login':
//           onLogin(data);
//           break;
//         case 'updateUsers':
//           updateUsersList(data);
//           break;
//         case 'removeUser':
//           removeUser(data);
//           break;
//         case 'offer':
//           onOffer(data);
//           break;
//         case 'answer':
//           onAnswer(data);
//           break;
//         case 'candidate':
//           onCandidate(data);
//           break;
//         default:
//           break;
//       }
//     }
//   }, [socketMessages]);
//   return (
//     <View>
//       {alert}
//       <Text>Simple WebRTC Chap App</Text>

//       {(socketOpen && <Fragment />) || (
//         <ActivityIndicator size="large" color="#0000ff" />
//       )}
//     </View>
//   );
// };
// export default Chat;
