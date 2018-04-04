import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';

const ToListButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image
        style={styles.image}
        source={require('../assets/images/content.png')}
      />
    </TouchableOpacity>
  );
};

const styles = {
  image: {
    width: 33,
    height: 33
  },
  container: {
    backgroundColor: 'transparent',
    opacity: 0.75
  }
};

export { ToListButton };
