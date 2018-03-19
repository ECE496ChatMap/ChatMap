import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Picker,
  Image,
  TextInput
} from 'react-native';
import { CardSection } from './CardSection';
import { MapInput } from './MapInput';
import TopicType from '../assets/categories/TopicType.json';

const IssueForm = ({ onClosePress, onContentChange, onPickerValueChange, pickerSelectedValue, onSubmitPress, style }) => {
  return (
    <CardSection style={[styles.container, style]}>
      <View style={styles.closeBox}>
        <TouchableOpacity onPress={onClosePress}>
          <Image
            source={require('../assets/images/close.png')}
            style={{width: 16, height: 16}}
          />
        </TouchableOpacity>
      </View>

      <CardSection style={styles.header}>
        <Image
          source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/8/88/%28Marie_Claire_Korea%29_%EC%A7%80%EA%B8%88%2C_%EC%9D%B4%EC%84%B1%EA%B2%BD.jpg'}}
          style={{width: 60, height: 60}}
        />
        <View style={styles.nameBox}>
          <Text style={styles.nameText}>
            Amanda
          </Text>
        </View>
      </CardSection>

      <CardSection style={styles.topicBox}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.topicText}>Topic: </Text>
        </View>
        <View style={{flexDirection: 'row', borderWidth: 1, borderColor: '#ddd'}}>
          <TextInput
            style={{flex: 1, fontSize: 15}}
            placeholder="Enter your topic"
            onChangeText={onContentChange}
            multiline={true}
            editable={true}
            numberOfLines={3}
            maxLength={100}
            blurOnSubmit={true}
          />
        </View>
      </CardSection>

      <CardSection style={styles.topicBox}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.categoryText}>Category: </Text>
        </View>
        <View style={{flexDirection: 'row', borderWidth: 1, borderColor: '#ddd'}}>
          <Picker
            style={{flex: 1}}
            selectedValue={pickerSelectedValue}
            onValueChange={onPickerValueChange}
          >
            {
              Object.keys(TopicType).map((key) => {
                return (
                  <Picker.Item label={key} value={key} key={key}/>
                )
              })
            }
          </Picker>
        </View>
      </CardSection>

      <CardSection style={styles.buttonSection}>
        <TouchableOpacity
          style={styles.button}
          onPress={onSubmitPress}
        >
          <Text style={styles.buttonText}>Submit</Text>
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
    padding: 15
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
  topicText: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 1
  },
  categoryText: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 1
  },
  button: {
    height: 40,
    width: 70,
    backgroundColor: '#8BC34A',
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

export { IssueForm };
