import React from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import { DeckSection } from './DeckSection';
import * as firebase from 'firebase';
import TopicType from '../assets/categories/TopicType.json';

const DeckDetail = ({ post, onPostPress }) => {
  const {
    content,
    category,
    key,
    issuer,
    timestamp
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

  var postDatetime = (new Date(timestamp)).toLocaleString();

  return (
    <View style={styles.container}>
      <View style={{width: 60, borderRightWidth: 1, borderColor: '#ddd'}}>
        <TouchableOpacity>
          <Image
            source={issuerUserProfile.pic}
            style={{width: 60, height: 60}}
          />
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'column', flex: 1}}>
        <TouchableOpacity onPress={onPostPress} style={{flexDirection: 'column'}}>
          <DeckSection>
            <View style={styles.contentStyle}>
              <Text style={{fontSize: 18}}>{issuerUserProfile.name}: {content}</Text>
            </View>
          </DeckSection>
          <DeckSection>
            <View style={styles.subcontentStyle}>
              <Text style={{color: TopicType[category], fontWeight: 'bold'}}>{category}</Text>
              <Text> posted on {postDatetime}</Text>
            </View>
          </DeckSection>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  container: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    flexDirection: 'row'
  },
  contentStyle: {
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  subcontentStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  headerTextStyle: {
    fontSize: 18
  },
  thumbnailStyle: {
    height: 50,
    width: 50
  },
  thumbnailContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10
  },
  imageStyle: {
    height: 300,
    flex: 1,
    width: null
  }
};

export { DeckDetail };
