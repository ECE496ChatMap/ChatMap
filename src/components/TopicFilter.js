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
import FilterType from '../assets/categories/FilterType.json';

class TopicFilter extends Component {

  render() {
    const {
      onPickerValueChange,
      pickerSelectedValue,
      onClosePress,
      style
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

        <CardSection style={styles.topicBox}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.categoryText}>I am interested in: </Text>
          </View>
          <View style={{flexDirection: 'row', borderWidth: 1, borderColor: '#ddd'}}>
            <Picker
              style={{flex: 1}}
              selectedValue={pickerSelectedValue}
              onValueChange={onPickerValueChange}
            >
              {
                Object.keys(FilterType).map((key) => {
                  return (
                    <Picker.Item label={key} value={key} key={key}/>
                  );
                })
              }
            </Picker>
          </View>
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

export { TopicFilter };
