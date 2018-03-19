import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import SettingsList from 'react-native-settings-list';
import { logoutUser } from '../actions';

class SettingScreen extends Component {
  static navigationOptions = { headerTitle: 'Settings' };

  render() {
    return (
      <View style={{ backgroundColor: '#f6f6f6', flex: 1 }}>
        <View style={{ backgroundColor: '#f6f6f6', flex: 1 }}>
          <SettingsList borderColor="#d6d5d9" defaultItemSize={50}>
            <SettingsList.Header headerStyle={{ marginTop: -5 }} />
            <SettingsList.Item
              hasNavArrow={false}
              title="Device"
              titleStyle={{
                color: '#009688',
                marginBottom: 10,
                fontWeight: 'bold'
              }}
              itemWidth={70}
              borderHide={'Both'}
            />
            <SettingsList.Item
              icon={
                <View style={styles.imageStyle}>
                  <Image
                    style={{ alignSelf: 'center', height: 22, width: 22 }}
                    source={require('../img/display2.png')}
                  />
                </View>
              }
              title="Display"
              itemWidth={70}
              titleStyle={{ color: 'black', fontSize: 16 }}
              hasNavArrow={false}
            />
            <SettingsList.Item
              icon={
                <View style={styles.imageStyle}>
                  <Image
                    style={{ alignSelf: 'center', height: 20, width: 18 }}
                    source={require('../img/sound.png')}
                  />
                </View>
              }
              title="Sound & notification"
              itemWidth={70}
              titleStyle={{ color: 'black', fontSize: 16 }}
              hasNavArrow={false}
            />
            <SettingsList.Item
              icon={
                <View style={styles.imageStyle}>
                  <Image
                    style={{ alignSelf: 'center', height: 18, width: 20 }}
                    source={require('../img/memory.png')}
                  />
                </View>
              }
              title="History"
              itemWidth={70}
              titleStyle={{ color: 'black', fontSize: 16 }}
              hasNavArrow={false}
            />
            <SettingsList.Item
              title="LOGOUT"
              itemWidth={70}
              titleStyle={{ color: 'black', fontSize: 16 }}
              hasNavArrow={false}
              onPress={() => this.props.logoutUser()}
            />
            <SettingsList.Header headerStyle={{ marginTop: -5 }} />
          </SettingsList>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageStyle: {
    marginLeft: 15,
    marginRight: 20,
    alignSelf: 'center',
    width: 20,
    height: 24,
    justifyContent: 'center'
  }
});

const mapStateToProps = state => {
  return {
    error: state.authReducer.error,
    loading: state.authReducer.loading
  };
};

export default connect(mapStateToProps, { logoutUser })(SettingScreen);
