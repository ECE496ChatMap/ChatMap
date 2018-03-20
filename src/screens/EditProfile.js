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

const User = t.struct({
  name: t.String,
  bio: t.maybe(t.String),

});
const options = {
    fields: {
      name: {
        error: 'Must put a name'
      }
    },
};
const Form = t.form.Form;

class editProfileScreen extends Component {
    handleSubmit = () => {
        const value = this._form.getValue(); // use that ref to get the form value

        const user = this.props.user.uid
        if(value){
            firebase.database().ref('profile/' + user).set({
                name: value.name,
                bio: value.bio
            });
        }
        //TODO: re-render
        console.log('value: ', value);
    }

    render(){
        const { navigate } = this.props.navigation;
        return(
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
  });
const mapStateToProps = state => {
    return {
        user: state.authReducer.user
    };
  };

export default connect(mapStateToProps,{}) (editProfileScreen);
