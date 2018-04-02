import React from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import { DeckSection } from './DeckSection';

const DeckDetail = ({ topic, onPress }) => {
  const { content, category, userImage } = topic;

  return (
    <View style={styles.container}>
      <View style={{width: 60, borderRightWidth: 1, borderColor: '#ddd'}}>
        <TouchableOpacity>
          <Image
            source={{uri: userImage}}
            style={{width: 60, height: 60}}
          />
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'column', flex: 1}}>
        <TouchableOpacity onPress={onPress} style={{flexDirection: 'column'}}>
          <DeckSection>
            <View style={styles.contentStyle}>
              <Text>Topic: {content}</Text>
            </View>
          </DeckSection>
          <DeckSection>
            <View style={styles.contentStyle}>
              <Text>{category}</Text>
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
