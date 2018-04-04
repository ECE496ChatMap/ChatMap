import React, { Component } from 'react';
import { View, Text, Button, Keyboard, Icon } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { HeaderBackButton } from 'react-navigation';
import { connect } from 'react-redux';
import { sendMessage } from '../actions/chatActions';

import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

class ChatScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { goBack, state } = navigation;
    return {
      title: state.params.roomTitle,
      headerLeft: (
        <HeaderBackButton
          onPress={() => {
            Keyboard.dismiss();
            goBack();
          }}
        />
      )
    };
  };

  onSend(messages = [], roomID) {
    this.props.sendMessage(messages, roomID);
  }

  render() {
    return (
      <GiftedChat
        messages={this.props.messages}
        user={{
          _id: this.props.user.uid
        }}
        //text={this.props.message}
        //onInputTextChanged={text => this.props.updatemessage(text)}
        onSend={messages => this.onSend(messages, this.props.roomID)}
        keyboardShouldPersistTaps="never"
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    sending: state.chatroomReducer.sending,
    sendError: state.chatroomReducer.sendError,
    messages: state.chatroomReducer.messages,
    loaded_Messages: state.chatroomReducer.loaded_Messages,
    loadError: state.chatroomReducer.loadError,
    user: state.authReducer.user,
    roomID: state.chatroomReducer.currentRoomID
  };
};

export default connect(mapStateToProps, {
  sendMessage
})(ChatScreen);
