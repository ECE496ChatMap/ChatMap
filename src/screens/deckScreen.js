import React, { Component } from 'react';
import {
   ScrollView,
   View,
   Text
 } from 'react-native';
import { connect } from 'react-redux';

import { DeckDetail } from '../components';

class DeckScreen extends Component {
  static navigationOptions = {
    title: 'Nearby Topics'
  };

  componentWillMount() {
    // fetch room data from firebase and setState of rooms
    // axios.get('https://rallycoding.herokuapp.com/api/music_albums')
    //   .then(response => this.setState({ rooms: response.data }));
  }

  constructor() {
    super();
    this.state = { topics: [
      { content: 'When is the concert?', type: 'Music', userImage: 'https://upload.wikimedia.org/wikipedia/commons/8/88/%28Marie_Claire_Korea%29_%EC%A7%80%EA%B8%88%2C_%EC%9D%B4%EC%84%B1%EA%B2%BD.jpg' },
      { content: 'Looking for teammates for basketball.', type: 'Sport', userImage: 'http://blog.psychicsforetell.com/wp-content/uploads/2012/11/Feminist-Ryan-Gosling-269x300.jpg' },
      { content: 'Waiting time at Starbucks?', type: 'Food', userImage: 'http://cache.etcnepal.com/wp-content/uploads/2016/05/Conan-OBrien.jpg' }
    ] };
  }
  renderRooms() {
    return this.state.topics.map(topic =>
      <DeckDetail key={topic.content} topic={topic} />
    );
  }
  render() {
    return (
      <View style={{ height: '100%', width: '100%' }}>
        <ScrollView>
          {this.renderRooms()}
        </ScrollView>
      </View>
    );
  }
}

export default connect()(DeckScreen);
