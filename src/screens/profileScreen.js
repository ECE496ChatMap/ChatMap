import React, { Component } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import Header from './Header'
import Bar from './Bar'

class ProfileScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;
    return {
      title: 'Profile',
      headerRight: (
        <Button title="Setting" onPress={() => navigate('setting')} />
      )
    };
  };

  render() {
    return (
      <View style={styles.container}>
        <Header />
        <Button
          title="edit"
          onPress={() => this.props.navigation.navigate('editProfile')}
        />
        <Bar />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  }
});

export default ProfileScreen;
