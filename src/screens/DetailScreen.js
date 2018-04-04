import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { TopicDetailForm } from '../components';
import firebase from 'firebase';

const screen = Dimensions.get('window');
const WINDOW_HEIGHT = screen.height;
const WINDOW_WIDTH = screen.width;
const FORM_HEIGHT = (WINDOW_HEIGHT - 200) * 0.9;

class DetailScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Post Detail'
    };
  };

  onEnterChatPressed = () => {
    // also send some indicators to database to register current user
    // with this topic
    var updates = {};
    updates[
      '/chathistory/' + firebase.auth().currentUser.uid + '/' + this.post.key
    ] = {
      content: this.post.content,
      createAt: firebase.database.ServerValue.TIMESTAMP
    };
    firebase
      .database()
      .ref()
      .update(updates);
    this.props.navigation.navigate('chat', { roomTitle: this.post.content });
  };

  render() {
    const { params } = this.props.navigation.state;
    const post = params ? params.post : null;
    this.post = post;
    return (
      <View
        style={{
          marginTop: 30,
          marginLeft: 20,
          marginRight: 20,
          height: FORM_HEIGHT
        }}
      >
        <TopicDetailForm
          style={styles.issueFormStyle}
          onEnterPress={this.onEnterChatPressed.bind(this)}
          onClosePress={() => this.props.navigation.goBack()}
          post={post}
        />
      </View>
    );
  }
}

const styles = {
  issueFormStyle: {
    zIndex: 100,
    alignSelf: 'center',
    alignItems: 'center'
  }
};

export default DetailScreen;
