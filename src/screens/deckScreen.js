import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Text,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import {
  DeckDetail
} from '../components';

const screen = Dimensions.get('window');
const WINDOW_HEIGHT = screen.height;
const WINDOW_WIDTH = screen.width;
const FORM_HEIGHT = (WINDOW_HEIGHT - 200) * 0.9;

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
    this.posts = null;
  }

  renderRooms = () => {
    if (this.posts === null) {
      return (
        <View style={{alignContent: 'center'}}>
          <Text style={{fontSize: 15}}>Nothing Found...</Text>
        </View>
      );
    }
    else {
      return this.posts.map(post =>
        <DeckDetail
          key={post.key}
          post={post}
          onPostPress={() => this.props.navigation.navigate('postDetail', {
            post: post
          })}
        />
      );
    }
  }

  render() {
    this.posts = this.props.navigation.state.params.posts;
    return (
      <View style={{ height: '100%', width: '100%', zIndex: -1}}>
        <ScrollView>
          {this.renderRooms()}
        </ScrollView>
      </View>
    );
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
