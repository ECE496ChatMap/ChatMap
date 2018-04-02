import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';

const FilterButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image
        style={styles.image}
        source={require('../assets/images/filter.png')}
      />
    </TouchableOpacity>
  );
};

const styles = {
  image: {
    width: 35,
    height: 35
  },
  container: {
    backgroundColor: 'transparent',
    opacity: 0.75
  }
};

export { FilterButton };
