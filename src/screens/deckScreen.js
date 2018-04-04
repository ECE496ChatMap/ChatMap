import React, { Component } from 'react';
import { ScrollView, View, Text, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { DeckDetail, TopicDetailForm } from '../components';

const screen = Dimensions.get('window');
const WINDOW_HEIGHT = screen.height;
const WINDOW_WIDTH = screen.width;
const FORM_HEIGHT = (WINDOW_HEIGHT - 200) * 0.9;

const userImages = [
  'https://upload.wikimedia.org/wikipedia/commons/8/88/%28Marie_Claire_Korea%29_%EC%A7%80%EA%B8%88%2C_%EC%9D%B4%EC%84%B1%EA%B2%BD.jpg',
  'http://blog.psychicsforetell.com/wp-content/uploads/2012/11/Feminist-Ryan-Gosling-269x300.jpg',
  'http://cache.etcnepal.com/wp-content/uploads/2016/05/Conan-OBrien.jpg'
];

const img =
  'https://upload.wikimedia.org/wikipedia/commons/8/88/%28Marie_Claire_Korea%29_%EC%A7%80%EA%B8%88%2C_%EC%9D%B4%EC%84%B1%EA%B2%BD.jpg';

class DeckScreen extends Component {
  static navigationOptions = {
    title: 'Nearby Topics'
  };

  constructor() {
    super();
    this.state = {
      myTopics: null,
      isShowDetail: false,
      curTid: null
    };
  }

  componentDidMount() {
    // listen to markers data
    var topicsRef = firebase.database().ref('topics');
    topicsRef.on(
      'value',
      function(snapshot) {
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
              timestamp: curTopic.timestamp,
              userImage: img
            }
          };
          curMarkers.push(myTopic);
          topicId++;
        }

        this.setState({ myTopics: curMarkers });
      }.bind(this)
    );

    //console.log('didmont');
    this.enableTopicDetailDisplay();
  }

  componentWillUnmount() {
    // detach listener
    firebase
      .database()
      .ref('topics')
      .off();
  }

  renderRooms = () => {
    if (this.state.myTopics === null) {
      return null;
    } else {
      return this.state.myTopics.map(topic => (
        <DeckDetail
          key={topic.tid}
          topic={topic.topic}
          onPress={() =>
            this.setState({
              curTid: topic.tid,
              isShowDetail: true
            })
          }
        />
      ));
    }
  };

  onEnterTopicPressed = () => {
    // also send some indicators to database to register current user
    // with this topic
    this.props.navigation.navigate('list');
  };

  renderTopicDetial = () => {
    if (this.state.isShowDetail && this.state.myTopics !== null) {
      var curTopic = this.state.myTopics[this.state.curTid].topic;
      return (
        <View
          style={{
            marginTop: 30,
            marginLeft: 20,
            marginRight: 20,
            height: FORM_HEIGHT
          }}
        >
          <TopicDetailForm
            style={styles.issueFormStyle}
            onEnterPress={this.onEnterTopicPressed.bind(this)}
            onClosePress={() =>
              this.setState({
                isShowDetail: false,
                curTid: null
              })
            }
            topic={curTopic}
          />
        </View>
      );
    }

    return null;
  };

  componentWillUpdate() {
    //console.log('willupate');
    this.enableTopicDetailDisplay();
  }
  //
  // componentWillMount() {
  //   this.enableTopicDetailDisplay();
  // }

  enableTopicDetailDisplay() {
    //console.log(this.props);
    if (
      this.props.navigation.state.params !== undefined &&
      this.props.navigation.state.params !== null
    ) {
      //console.log('hereeeeeeeeeee');
      var tid = this.props.navigation.state.params.markerId;
      this.setState({ curTid: tid, isShowDetail: true });
      // this.props.navigation.state.params = null;
    }
  }

  render() {
    if (this.state.isShowDetail) {
      return this.renderTopicDetial();
    } else {
      return (
        <View style={{ height: '100%', width: '100%', zIndex: -1 }}>
          <ScrollView>{this.renderRooms()}</ScrollView>
        </View>
      );
    }
  }
}

const styles = {
  issueFormStyle: {
    zIndex: 100,
    alignSelf: 'center',
    alignItems: 'center'
  }
};

export default connect()(DeckScreen);
