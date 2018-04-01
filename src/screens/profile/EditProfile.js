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

import t from 'tcomb-form-native';

const User = t.struct({
  name: t.String,
  bio: t.String
});

const Form = t.form.Form;

class editProfileScreen extends Component {
  handleSubmit = () => {
    const value = this._form.getValue(); // use that ref to get the form value
    const { Name, Bio } = value;

    console.log('value: ', value);
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Form type={User} />
        <Button title="Save" onPress={this.handleSubmit} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff'
  }
});
export default editProfileScreen;
