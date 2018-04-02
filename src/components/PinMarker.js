import React from 'react';

import {
  StyleSheet,
  View,
  Text
} from 'react-native';

class PinMarker extends React.Component {
  render() {
    const { backgroundColor } = this.props;
    return (
      <View style={styles.container}>
        <View style={[styles.bubble, {backgroundColor: backgroundColor}]} >
          <Text style={{fontSize: 13, color: 'transparent'}}>H</Text>
        </View>
        <View style={styles.arrowBorder} />
        <View style={[styles.arrow, {borderTopColor: backgroundColor}]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start'
  },
  bubble: {
    flex: 0,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#FF5A5F',
    padding: 2,
    borderRadius: 6,
    borderColor: 'transparent',
    borderWidth: 0.5
  },
  topic: {
    color: '#FFFFFF',
    fontSize: 13
  },
  arrow: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#FF5A5F',
    alignSelf: 'center',
    marginTop: -9
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: 'transparent',
    alignSelf: 'center',
    marginTop: -0.5
  }
});

// backup original styles
// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'column',
//     alignSelf: 'flex-start',
//   },
//   bubble: {
//     flex: 0,
//     flexDirection: 'row',
//     alignSelf: 'flex-start',
//     backgroundColor: '#FF5A5F',
//     padding: 2,
//     borderRadius: 3,
//     borderColor: '#D23F44',
//     borderWidth: 0.5,
//   },
//   topic: {
//     color: '#FFFFFF',
//     fontSize: 13,
//   },
//   arrow: {
//     backgroundColor: 'transparent',
//     borderWidth: 4,
//     borderColor: 'transparent',
//     borderTopColor: '#FF5A5F',
//     alignSelf: 'center',
//     marginTop: -9,
//   },
//   arrowBorder: {
//     backgroundColor: 'transparent',
//     borderWidth: 4,
//     borderColor: 'transparent',
//     borderTopColor: '#D23F44',
//     alignSelf: 'center',
//     marginTop: -0.5,
//   },
// });

export { PinMarker };
