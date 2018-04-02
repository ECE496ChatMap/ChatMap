import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

class ListScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;
    return {
      title: 'ChatRoom',
      headerRight: <Button title="Chat" onPress={() => navigate('chat')} />
    };
  };

  render() {
    return (
      <View>
        <Text>ListScreen</Text>
        <Text>ListScreen</Text>
        <Text>ListScreen</Text>
        <Text>ListScreen</Text>
        <Text>ListScreen</Text>
      </View>
    );
  }
}

export default ListScreen;
