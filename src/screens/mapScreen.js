import React, { Component } from 'react';
import {
  View,
  Alert,
  Dimensions,
  Text
} from 'react-native';
import MapView from 'react-native-maps';
import RNGooglePlaces from 'react-native-google-places';
import firebase from 'firebase';

import {
  SearchButton,
  CustomMarker,
  IssueButton,
  IssueForm,
  MyLocationButton
} from '../components';
import TopicType from '../assets/categories/TopicType.json';

//////// suppress the continous displaying of 'setting a timer' warning //////
import { YellowBox } from 'react-native';
import _ from 'lodash';


YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};
////////////////////////////////////////////////////////////////////////////

const screen = Dimensions.get('window');
const WINDOW_HEIGHT = screen.height;
const WINDOW_WIDTH = screen.width;
const ASPECT_RATIO = WINDOW_WIDTH / WINDOW_HEIGHT;
const INITIAL_LATITUDE = 43.6608;
const INITIAL_LONGITUDE = -79.3955;
// const LATITUDE_DELTA = 0.0922;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = 0.005;

const FORM_HEIGHT = (WINDOW_HEIGHT - 200) * 0.9;

const MARKER_LATITUDE = 43.6466495;
const MARKER_LONGITUDE = -79.3759458;

class MapScreen extends Component {
  static navigationOptions = {
    title: 'Map',
    header: null
  };

  _map = null;

  constructor() {
    super();
    this.state = {
      mapRegion: {
        latitude: INITIAL_LATITUDE,
        longitude: INITIAL_LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      userRegion: {
        latitude: INITIAL_LATITUDE,
        longitude: INITIAL_LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      showForm: false,
      topicContent: '',
      topicCategory: 'Music',
      newTopic: {
        category: null,
        content: null,
        coordinates: null
      },
      showPin: false,
      myMarkers: null
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          userRegion: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          },
          mapRegion: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }
        });
      },
      error => {
        console.log(error);
        switch (error.code) {
          case 1:
            Alert.alert('', 'Error get current position');
            break;
          default:
            Alert.alert('', 'Default Error get current position');
        }
      }
    );

    this.watchID = navigator.geolocation.watchPosition(
      position => {
        this.setState({
          userRegion: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }
        });
      }
    );

    // listen to markers data
    var topicsRef = firebase.database().ref('topics');
    topicsRef.on('value', function(snapshot) {
      var allTopics = snapshot.val();
      var curMarkers = [];
      var topicId = 0;
      for (var topicKey in allTopics) {
        var curTopic = allTopics[topicKey];
        var myTopic = {
          id: topicId,
          topic: curTopic.category,
          coordinate: {
            latitude: curTopic.region.latitude,
            longitude: curTopic.region.longitude
          }
        };
        curMarkers.push(myTopic);
        topicId++;
      }

      this.setState({myMarkers: curMarkers});
    }.bind(this));
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);

    // detach listener
    firebase.database().ref('topics').off();
  }

  onRegionChange(region) {
    this.setState({ mapRegion: region });
  }

  openSearchModal() {
    RNGooglePlaces.openAutocompleteModal()
      .then(place => {
        // place represents user's selection from the
        // suggestions and it is a simplified Google Place object.
        this.setState({
          mapRegion: {
            latitude: place.latitude,
            longitude: place.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          },
          showPin: true
        });
      })
      .catch(error => console.log(error.message)); // error is a Javascript Error object
  }

  onTopicSubmit = () => {
    const { topicContent, topicCategory, mapRegion } = this.state;
    // var d = new Date();
    var currentTime = Date.now();
    var myDuration = 3600 * 1000; // 1 hr

    const { currentUser } = firebase.auth();

    var topicData = {
      issuer: currentUser.uid,
      category: topicCategory,
      content: topicContent,
      region: mapRegion,
      timestamp: currentTime,
      duration: myDuration
    };

    var newTopicKey = firebase.database().ref().child('topics').push().key;

    var updates = {};
    updates['/users/' + currentUser.uid + '/topics/' + newTopicKey] = true;
    updates['/topics/' + newTopicKey] = topicData;
    updates['/categories/' + topicCategory + '/' + newTopicKey] = true;
    updates['/chatrooms/' + newTopicKey + '/issuer'] = currentUser.uid;

    firebase.database().ref().update(updates);

    this.setState({
      showForm: false,
      showPin: false
    });
  };

  renderSearchPin() {
    const coord = {
      latitude: this.state.mapRegion.latitude,
      longitude: this.state.mapRegion.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    };
    if (this.state.showPin) {
      return (
        <MapView.Marker
          key={6}
          coordinate={coord}
        >
          <CustomMarker
            topic={'Pin'}
            backgroundColor={TopicType['Pin']}
          />
        </MapView.Marker>
      );
    }
  }

  renderIssueForm = () => {
    if (this.state.showForm) {
      return (
        <View style={{marginTop: 30, marginLeft: 20, marginRight: 20, height: FORM_HEIGHT}}>
          <IssueForm
            style={styles.issueFormStyle}
            onContentChange={text => this.setState({ topicContent: text })}
            onPickerValueChange={(itemValue, itemIndex) => this.setState({ topicCategory: itemValue })}
            pickerSelectedValue={this.state.topicCategory}
            onSubmitPress={this.onTopicSubmit.bind(this)}
            onClosePress={() => this.setState({ showForm: false })}
          />
        </View>
      );
    }

    return null;
  }

  renderMarkers() {
    if (this.state.myMarkers === null) {
      return null;
    }
    else {
      return (
        this.state.myMarkers.map((marker, i) => {
          var topic = marker.topic;
          return (
            <MapView.Marker
              key={marker.id}
              coordinate={marker.coordinate}
              onPress={() => this.props.navigation.navigate('deck', {
                markerId: marker.id
              })}
            >
              <CustomMarker
                topic={topic}
                backgroundColor={TopicType[topic]}
              />
            </MapView.Marker>
          );
        })
      );
    }
  }

  animateToCurrentLocation = async () => {
    this.setState({showPin: false});
    this._map.animateToRegion({
      latitude: this.state.userRegion.latitude,
      longitude: this.state.userRegion.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    }, 2000);
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          ref={component => {this._map = component;}}
          showsUserLocation
          followsUserLocation
          showsMyLocationButton={false}
          style={styles.MapStyle}
          region={this.state.mapRegion}
          onRegionChangeComplete={this.onRegionChange.bind(this)}
          onPress={() => this.setState({ showForm: false })}
        >
          {this.renderMarkers()}

          {this.renderSearchPin()}
        </MapView>

        <View style={styles.searchView}>
          <SearchButton onPress={() => this.openSearchModal()}>
            <Text>Explore your surrounding</Text>
          </SearchButton>
        </View>

        {this.renderIssueForm()}

        <IssueButton
          onPress={() => this.setState({ showForm: !this.state.showForm })}
        />

        <View style={styles.myLocationButton}>
          <MyLocationButton
            onPress={() => this.animateToCurrentLocation()}
          />
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#F5FCFF'
  },
  MapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1
  },
  searchView: {
    height: 50,
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 100,
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  issueButtonStyle: {
    height: WINDOW_HEIGHT,
    alignSelf: 'center'
  },
  issueFormStyle: {
    zIndex: 100,
    alignSelf: 'center',
    alignItems: 'center'
  },
  myLocationButton: {
    height: 35,
    width: 35,
    position: 'absolute',
    zIndex: 100,
    bottom: 135,
    right: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 10
  }
};

export default MapScreen;
