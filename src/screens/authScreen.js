import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Card, CardSection, Input, Button, Spinner } from '../components';
import { connect } from 'react-redux';
import {
  loginemailChanged,
  loginpasswordChanged,
  loginUser,
  checksession,
  navtoReg
} from '../actions';

class AuthScreen extends Component {
  static navigationOptions = {
    title: 'Authentication'
  };

  renderError() {
    if (this.props.loginerror) {
      return (
        <View style={{ backgroundColor: 'white' }}>
          <Text
            style={{
              fontSize: 20,
              alignSelf: 'center',
              color: 'red'
            }}
          >
            {this.props.loginerror}
          </Text>
        </View>
      );
    }
  }

  renderAuthButtons() {
    const { loginemail, loginpassword } = this.props;

    if (this.props.loading) {
      return (
        <CardSection>
          <Spinner size="large" />
        </CardSection>
      );
    }
    return (
      <CardSection>
        <Button
          onPress={() => this.props.loginUser({ loginemail, loginpassword })}
        >
          Login
        </Button>
        <Button onPress={() => this.props.navtoReg()}>New User?</Button>
      </CardSection>
    );
  }

  render() {
    const { loginemail, loginpassword } = this.props;
    if (this.props.loading_session) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Spinner size="large" />
        </View>
      );
    } else {
      return (
        <Card>
          <CardSection>
            <Input
              label="Email"
              placeholder="email@gmail.com"
              onChangeText={text => this.props.loginemailChanged(text)}
              value={loginemail}
            />
          </CardSection>

          <CardSection>
            <Input
              secureTextEntry
              label="Password"
              placeholder="password"
              onChangeText={text => this.props.loginpasswordChanged(text)}
              value={loginpassword}
            />
          </CardSection>

          {this.renderError()}
          {this.renderAuthButtons()}
        </Card>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    loginemail: state.authReducer.loginemail,
    loginpassword: state.authReducer.loginpassword,
    loginerror: state.authReducer.loginerror,
    loading: state.authReducer.loading,
    loading_session: state.authReducer.loading_session
  };
};

export default connect(mapStateToProps, {
  loginemailChanged,
  loginpasswordChanged,
  loginUser,
  checksession,
  navtoReg
})(AuthScreen);
