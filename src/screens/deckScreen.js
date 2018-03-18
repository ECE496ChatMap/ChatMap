import React, { Component } from 'react';
import {
   ScrollView,
   View,
   Text
 } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { DeckDetail } from '../components';

const userImages = [
  'https://upload.wikimedia.org/wikipedia/commons/8/88/%28Marie_Claire_Korea%29_%EC%A7%80%EA%B8%88%2C_%EC%9D%B4%EC%84%B1%EA%B2%BD.jpg',
  'http://blog.psychicsforetell.com/wp-content/uploads/2012/11/Feminist-Ryan-Gosling-269x300.jpg',
  'http://cache.etcnepal.com/wp-content/uploads/2016/05/Conan-OBrien.jpg'
];

const img = 'https://upload.wikimedia.org/wikipedia/commons/8/88/%28Marie_Claire_Korea%29_%EC%A7%80%EA%B8%88%2C_%EC%9D%B4%EC%84%B1%EA%B2%BD.jpg';

class DeckScreen extends Component {
  static navigationOptions = {
    title: 'Nearby Topics'
  };

  constructor() {
    super();
    this.state = {
      // topics: [
      //   { content: 'When is the concert?', type: 'Music', userImage: 'https://upload.wikimedia.org/wikipedia/commons/8/88/%28Marie_Claire_Korea%29_%EC%A7%80%EA%B8%88%2C_%EC%9D%B4%EC%84%B1%EA%B2%BD.jpg' },
      //   { content: 'Looking for teammates for basketball.', type: 'Sport', userImage: 'http://blog.psychicsforetell.com/wp-content/uploads/2012/11/Feminist-Ryan-Gosling-269x300.jpg' },
      //   { content: 'Waiting time at Starbucks?', type: 'Food', userImage: 'http://cache.etcnepal.com/wp-content/uploads/2016/05/Conan-OBrien.jpg' }
      // ],
      myTopics: null
    };
  }

  componentDidMount() {
    console.log('lalalalalalalala');
    // listen to markers data
    var topicsRef = firebase.database().ref('topics');
    topicsRef.on('value', function(snapshot) {
      var allTopics = snapshot.val();
      var curMarkers = [];
      var topicId = 0;
      for (var topicKey in allTopics) {
        var curTopic = allTopics[topicKey];
        var myTopic = {
          tid: topicId,
          topic: {
            content: curTopic.content,
            category: curTopic.category,
            userImage: img
          }
        };
        curMarkers.push(myTopic);
        topicId++;
      }
      console.log('bbbbbbbbbbb');
      console.log(curMarkers);

      this.setState({myTopics: curMarkers});
    }.bind(this));
  }

  componentWillUnmount() {
    // detach listener
    firebase.database().ref('topics').off();
  }

  renderRooms = () => {
    if (this.state.myTopics === null) {
      console.log('-------- null');
      return null;
    }
    else {
      console.log('try me');
      console.log(this.state.myTopics);
      return this.state.myTopics.map(topic =>
        <DeckDetail
          key={topic.tid}
          topic={topic.topic}
        />
      );
    }
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
