import React, { Component } from 'react';
import { View, Text, Button, ListView, TouchableHighlight } from 'react-native';
import { List, ListItem, Avatar, Badge } from 'react-native-elements';
import { connect } from 'react-redux';
import { loadChatRoom } from '../actions';
import moment from 'moment';

// const list = [
//   {
//     name: 'Amy Farha',
//     avatar_url:
//       'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
//     subtitle: 'Vice President',
//     key: '234556'
//   },
//   {
//     name: 'Chris Jackson',
//     avatar_url:
//       'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
//     subtitle: 'Vice Chairman',
//     key: '12345'
//   }
// ];

class ListScreen extends Component {
  static navigationOptions = {
    title: 'ChatRoom'
  };

  renderRow(rowData, sectionID) {
    // console.log(
    //   moment(1522806922620).calendar(null, {
    //     sameDay: 'LT',
    //     nextDay: '[Tomorrow]',
    //     nextWeek: 'dddd',
    //     lastDay: '[Yesterday]',
    //     sameElse: 'DD/MM/YYYY'
    //   })
    // );
    return (
      <ListItem
        roundAvatar
        rightTitle={moment(rowData.time).calendar(null, {
          sameDay: 'LT',
          nextDay: '[Tomorrow]',
          nextWeek: 'dddd',
          lastDay: '[Yesterday]',
          sameElse: 'DD/MM/YYYY'
        })}
        //rightTitleContainerStyle={{ marginTop: -20, marginRight: 70, flex: 0 }}
        hideChevron
        //wrapperStyle={{ flexDirection: '' }}
        key={rowData.key}
        title={rowData.title}
        subtitle={rowData.subtitle}
        avatar={
          <View style={{ alignItems: 'center' }}>
            <View>
              <Avatar
                rounded
                medium
                source={{
                  uri:
                    'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  width: 15,
                  height: 15,
                  borderRadius: 7.5,
                  right: -1,
                  top: -1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#EF5350'
                }}
              />
            </View>
          </View>
        }
        onPress={() => {
          this.props.loadChatRoom(rowData.key, rowData.title);
          this.props.navigation.navigate('chat', { roomTitle: rowData.title });
        }}
        underlayColor="#e6e6e6"
      />
    );
  }

  render() {
    return (
      <List containerStyle={{ marginTop: 0 }}>
        <ListView
          enableEmptySections
          renderRow={this.renderRow.bind(this)}
          dataSource={this.props.dataSource}
        />
      </List>
    );
  }
}

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2
});

const mapStateToProps = state => {
  return {
    dataSource: ds.cloneWithRows(state.chatlistReducer.list)
  };
};

export default connect(mapStateToProps, { loadChatRoom })(ListScreen);
