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
import ProfilePicture from '../components/ProfilePicture'
import { StackNavigator } from 'react-navigation';

class Header extends Component<{}> {
    constructor(props){
        super(props);
        this.state = {   name: 'Anonymous',
                        bio: 'No bio'
        };
    }
    componentDidMount() {
        const user = this.props.user.uid;
        var username;
        var bio;
        firebase.database().ref('/profile/' + user).once('value', (snapshot) => {
            username = (snapshot.val() && snapshot.val().name) || 'Anonymous';
            bio = (snapshot.val() && snapshot.val().bio) || 'No bio';
            this.handleChange(username, bio);
        });

    }
    handleChange = (_name, _bio) => {
        this.setState(
            (prevState) => ({
                name: _name,
                bio: _bio
            })
        )
    }

  render() {
    return (
        <ImageBackground style={styles.headerBackground} source ={require('../img/background.jpg')}>

            <View style={styles.header}>
                <ProfilePicture />
                <Text style = {styles.name}> {this.state.name} </Text>
                <Text style = {styles.body}> {this.state.bio} </Text>

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
        backgroundColor: 'rgba(0,0,0, 0.5)',

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

const mapStateToProps = state => {
    return {
        user: state.authReducer.user
    };
  };

export default connect(mapStateToProps,{}) (Header);