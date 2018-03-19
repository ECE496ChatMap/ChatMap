import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Button
} from 'react-native';
import ProfilePicture from '../../components/ProfilePicture';
import { StackNavigator } from 'react-navigation';

export default class Header extends Component<{}> {
  render() {
    return (
      <ImageBackground
        style={styles.headerBackground}
        source={require('../../img/background.jpg')}
      >
        <View style={styles.header}>
          <ProfilePicture />
          <Text style={styles.name}> Elon Musk </Text>
          <Text style={styles.body}>
            I am Elon Musk, founder, CEO, and lead designer of SpaceX.
          </Text>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  headerBackground: {
    flex: 1,
    width: null,
    alignSelf: 'stretch'
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0, 0.5)'
  },
  name: {
    flex: 1,
    marginTop: 5,
    alignItems: 'center',
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold'
  },
  body: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    fontStyle: 'italic'
  },
  butt: {
    flex: 1
  }
});
