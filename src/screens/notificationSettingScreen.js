import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import SettingsList from 'react-native-settings-list';
import { logoutUser } from '../actions';

class notificationSettingScreen extends Component {
  constructor(){
    super();
    this.onValueChange = this.onValueChange.bind(this);
    this.state = {switchValue: false, loggedIn: false};
  }
  render() {
    return (
      <View style={{backgroundColor:'#f6f6f6',flex:1}}>
        <View style={{borderBottomWidth:1, backgroundColor:'#263238',borderColor:'#c8c7cc'}}>
          <Text style={{color:'white',marginTop:15,marginBottom:15, marginLeft:15,fontWeight:'bold',fontSize:20}}>Settings</Text>
        </View>
        <View style={{backgroundColor:'#f6f6f6',flex:1}}>
          <SettingsList borderColor='#d6d5d9' defaultItemSize={50}>
            <SettingsList.Header headerStyle={{marginTop:-5}}/>
            <SettingsList.Item
              hasNavArrow={false}
              title='Sound & Notifications'
              titleStyle={{color:'#009688', marginBottom:10, fontWeight:'bold'}}
              itemWidth={70}
              borderHide={'Both'}
            />
            <SettingsList.Item
              icon={
                <View style={styles.imageStyle}>
                  <Image style={{alignSelf:'center',height:20, width:18}} source={require('../img/sound.png')}/>
                </View>
              }
              title='Volume'
              itemWidth={70}
              titleStyle={{color:'black', fontSize: 16}}
              hasNavArrow={false}
            />
            <SettingsList.Item
              icon={
                <View style={styles.imageStyle}>
                  <Image style={{alignSelf:'center',height:18, width:20}} source={require('../img/memory.png')}/>
                </View>
              }
              title='Notifications'
              itemWidth={70}
              titleStyle={{color:'black', fontSize: 16}}
              hasNavArrow={false}
              hasSwitch={true}
              switchState={this.state.switchValue}
              switchOnValueChange={this.onValueChange}
            />
            <SettingsList.Header headerStyle={{marginTop: -5}}/>
          </SettingsList>
        </View>
      </View>
    );
  }
  onValueChange(value){
    this.setState({switchValue: value});
  }
}

const styles = StyleSheet.create({
  imageStyle:{
    marginLeft:15,
    marginRight:20,
    alignSelf:'center',
    width:20,
    height:24,
    justifyContent:'center'
  }
});

const mapStateToProps = state => {
  return {
    error: state.authReducer.error,
    loading: state.authReducer.loading
  };
};

export default connect(mapStateToProps, { logoutUser })(notificationSettingScreen);