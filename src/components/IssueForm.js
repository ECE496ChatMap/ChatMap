import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Picker,
  Image,
  TextInput,
  Slider
} from 'react-native';
import { CardSection } from './CardSection';
import TopicType from '../assets/categories/TopicType.json';

class IssueForm extends Component {

  constructor() {
    super();
    this.state = {
      duration: 1
    };
  }

  testInput = null;

  clearText() {
    this.testInput.setNativeProps({ text: '' });
  }

  render() {
    const {
      onClosePress,
      onContentChange,
      onSlidingComplete,
      onPickerValueChange,
      pickerSelectedValue,
      onSubmitPress,
      style,
      userImage,
      userName
    } = this.props;

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
            source={{uri: userImage}}
            style={{width: 60, height: 60}}
          />
          <View style={styles.nameBox}>
            <Text style={styles.nameText}>
              {userName}
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
              placeholder="Enter your post"
              onChangeText={onContentChange}
              multiline={true}
              editable={true}
              numberOfLines={3}
              maxLength={100}
              blurOnSubmit={true}
              underlineColorAndroid={'rgba(0,0,0,0)'}
              ref={element => {this.testInput = element;}}
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
                  );
                })
              }
            </Picker>
          </View>
        </CardSection>

        <CardSection style={styles.topicBox}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.categoryText}>Duration: </Text>
            <Text>{this.state.duration} (hours)</Text>
          </View>
          <View style={{flexDirection: 'row', borderWidth: 1, borderColor: '#ddd'}}>
            <Slider
              style={{width: 300}}
              step={5}
              minimumValue={1}
              maximumValue={150}
              value={1}
              onValueChange={val => this.setState({ duration: val })}
              onSlidingComplete={onSlidingComplete}
            />
          </View>
        </CardSection>

        <CardSection style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.button}
            onPress={onSubmitPress}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>

          <Text>         </Text>

          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => this.clearText()}
          >
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        </CardSection>

      </CardSection>
    );
  }
}

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
  clearButton: {
    height: 40,
    width: 70,
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
    paddingTop: 20,
    flexDirection: 'row'
  }
};

export { IssueForm };
