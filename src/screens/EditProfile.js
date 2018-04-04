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
import { connect } from 'react-redux';
import firebase from 'firebase';
import t from 'tcomb-form-native';
import ImagePicker from 'react-native-image-crop-picker';

const User = t.struct({
  name: t.String,
  bio: t.maybe(t.String)
});
const options = {
  fields: {
    name: {
      error: 'Must put a name'
    }
  }
};
const Form = t.form.Form;

class editProfileScreen extends Component {
  constructor() {
    super();
    this.state = {
      image: null,
      images: null
    };
  }
  handleSubmit = () => {
    const value = this._form.getValue(); // use that ref to get the form value

    const user = this.props.user.uid;
    if (value) {
      firebase
        .database()
        .ref('users/' + user + '/profile')
        .set({
          name: value.name,
          bio: value.bio
        });
    }
    //TODO: re-render
    console.log('value: ', value);
  };

  pickSingle(cropit, circular=false) {
    const user = this.props.user.uid;

    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: cropit,
      cropperCircleOverlay: circular,
      compressImageMaxWidth: 640,
      compressImageMaxHeight: 480,
      compressImageQuality: 0.5,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
    }).then(image => {
      console.log('received image', image);
      const imageRef = firebase.storage().ref(user).child("dp.jpg")
      this.setState({
        image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
        images: null
      });
    }).catch(e => {
      console.log(e);
      Alert.alert(e.message ? e.message : e);
    });
  }

  render(){
    const { navigate } = this.props.navigation;
    return(
      <View>
        <View style={styles.container}>
            <Form
                ref={c => this._form = c}
                type={User}
                options={options}
             />
            <Button
            title="Save"
            onPress={this.handleSubmit}
            />

        </View>
        <View style={styles.picture}>
            <Button
            title="Update Profile Picture"
            onPress={() => this.pickSingle(false)}
            />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      marginTop: 50,
      padding: 20,
      backgroundColor: '#ffffff',
    },
    picture: {
      justifyContent: 'center',
      marginTop: 10,
      padding: 20,
      backgroundColor: '#ffffff',
    }
  });
const mapStateToProps = state => {
  return {
    user: state.authReducer.user
  };
};

export default connect(mapStateToProps, {})(editProfileScreen);
