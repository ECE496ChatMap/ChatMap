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
    const { goBack } = navigation;
    return {
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

  onSend(messages = []) {
    this.props.sendMessage(messages);
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
        onSend={messages => this.onSend(messages)}
        keyboardShouldPersistTaps="never"
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    sending: state.chatReducer.sending,
    sendError: state.chatReducer.sendError,
    messages: state.chatReducer.messages,
    loaded_Messages: state.chatReducer.loaded_Messages,
    loadError: state.chatReducer.loadError,
    user: state.authReducer.user
  };
};

export default connect(mapStateToProps, {
  sendMessage
})(ChatScreen);
