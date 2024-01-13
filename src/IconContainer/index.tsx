import React, {FC} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

// const buttonStyle = {
//   height: 50,
//   aspectRatio: 1,
//   justifyContent: 'center',
//   alignItems: 'center',
// };
type Props = {
  onPress: () => void;
  style?: any;
  backgroundColor?: string;
  Icon: any;
};
const IconContainer: FC<Props> = ({backgroundColor, onPress, Icon, style}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[style, styles.container, backgroundColorValue(backgroundColor)]}>
      {Icon}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    borderRadius: 30,
    height: 60,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export const backgroundColorValue = (backgroundColor?: string) => {
  return backgroundColor ? backgroundColor : 'transparent';
};
export default IconContainer;
