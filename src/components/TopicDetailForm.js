import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  TextInput
} from 'react-native';
import { CardSection } from './CardSection';
import * as firebase from 'firebase';
import TopicType from '../assets/categories/TopicType.json';

const TopicDetailForm = ({ onClosePress, onEnterPress, post, style }) => {
  const {
    content,
    key,
    issuer,
    timestamp,
    category
  } = post;

  // query issuer's info
  var issuerUserProfile = {
    name: 'Anonymous',
    bio: 'This person doesn\'t have a bio yet.',
    pic: require('../assets/images/dummyProfile.png')
  };
  firebase.database().ref('/users/' + issuer).once('value').then(function(snapshot) {
    var issuerUser = snapshot.val();
    console.log('check curUser');
    console.log(issuerUser);
    if (issuerUser.hasOwnProperty('profile')) {
      if (issuerUser.profile.name !== null &&
          issuerUser.profile.name !== '') {
        issuerUserProfile.name = issuerUser.profile.name;
      }
      if (issuerUser.profile.bio !== null &&
          issuerUser.profile.bio !== '') {
        issuerUserProfile.bio = issuerUser.profile.bio;
      }
    }
  });

  var topicDatetime = (new Date(timestamp)).toLocaleString();

  return (
    <CardSection style={[styles.container, style]}>
      <CardSection style={styles.header}>
        <Image
          source={issuerUserProfile.pic}
          style={{width: 60, height: 60}}
        />
        <View style={styles.nameBox}>
          <Text style={styles.nameText}>
            {issuerUserProfile.name}
          </Text>
          <Text>Posted on: {topicDatetime}</Text>
        </View>
      </CardSection>

      <CardSection style={styles.topicBox}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.topicText}>Says: </Text>
        </View>
        <View style={{flex: 1, marginTop: 10, alignSelf: 'stretch', flexDirection: 'row', borderWidth: 1, borderColor: '#ddd'}}>
          <Text style={{fontSize: 20}}>{content}</Text>
        </View>
      </CardSection>

      <CardSection style={styles.categoryBox}>
        <Text style={styles.categoryText}>Category: </Text>
        <Text style={{color: TopicType[category], fontSize: 18, fontWeight: 'bold'}}>{category}</Text>
      </CardSection>

      <CardSection style={styles.buttonSection}>
        <TouchableOpacity
          style={styles.button}
          onPress={onEnterPress}
        >
          <Text style={styles.buttonText}>Enter Chat</Text>
        </TouchableOpacity>

        <Text>      </Text>

        <TouchableOpacity
          style={styles.leaveButton}
          onPress={onClosePress}
        >
          <Text style={styles.buttonText}>Leave</Text>
        </TouchableOpacity>
      </CardSection>

    </CardSection>
  );
};

const styles = {
  container: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    padding: 10,
    paddingTop: 20,
    backgroundColor: 'rgba(255,255,255,0.90)',
    alignSelf: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column'
  },
  closeBox: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    paddingRight: 2
  },
  header: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    backgroundColor: 'transparent'
  },
  nameBox: {
    justifyContent: 'center',
    padding: 5
  },
  nameText: {
    fontSize: 20
  },
  topicBox: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'transparent'
  },
  categoryBox: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    borderColor: 'transparent'
  },
  topicText: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 1
  },
  categoryText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  button: {
    height: 40,
    width: 100,
    backgroundColor: '#8BC34A',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  leaveButton: {
    height: 40,
    width: 100,
    backgroundColor: '#FF5722',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold'
  },
  buttonSection: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    paddingTop: 20
  }
};

export { TopicDetailForm };
