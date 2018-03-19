import React, { Component } from 'react';
import { View, Alert, Dimensions, Text } from 'react-native';
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

const markers = [
  {
    id: 0,
    topic: 'Music',
    coordinate: {
      latitude: MARKER_LATITUDE,
      longitude: MARKER_LONGITUDE
    }
  },
  {
    id: 1,
    topic: 'Sport',
    coordinate: {
      latitude: MARKER_LATITUDE + 0.004,
      longitude: MARKER_LONGITUDE - 0.004
    }
  },
  {
    id: 2,
    topic: 'Study',
    coordinate: {
      latitude: MARKER_LATITUDE - 0.004,
      longitude: MARKER_LONGITUDE - 0.004
    }
  }
];

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
      showPin: false
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

    this.watchID = navigator.geolocation.watchPosition(position => {
      this.setState({
        userRegion: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }
      });
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
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
    var d = new Date();
    var currentTime = d.toUTCString();

    const { currentUser } = firebase.auth();
    // firebase
    //   .database()
    //   .ref(`users/${currentUser.uid}/topics`)
    //   .push({ topicContent, topicCategory, mapRegion, currentTime });
    // this.setState({ showForm: false });

    this.setState({
      newTopic: {
        category: topicCategory,
        content: topicContent,
        coordinates: mapRegion
      },
      showForm: false
    });
  };

  renderDumpMarker() {
    if (this.state.newTopic.category !== null) {
      return (
        <MapView.Marker key={5} coordinate={this.state.newTopic.coordinates}>
          <CustomMarker
            topic={this.state.newTopic.category}
            backgroundColor={TopicType[this.state.newTopic.category]}
          />
        </MapView.Marker>
      );
    }
  }

  renderSearchPin() {
    const coord = {
      latitude: this.state.mapRegion.latitude,
      longitude: this.state.mapRegion.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    };
    if (this.state.showPin) {
      return (
        <MapView.Marker key={6} coordinate={coord}>
          <CustomMarker topic={'Pin'} backgroundColor={TopicType['Pin']} />
        </MapView.Marker>
      );
    }
  }

  renderIssueForm = () => {
    if (this.state.showForm) {
      return (
        <View
          style={{
            marginTop: 30,
            marginLeft: 20,
            marginRight: 20,
            height: FORM_HEIGHT
          }}
        >
          <IssueForm
            style={styles.issueFormStyle}
            onContentChange={text => this.setState({ topicContent: text })}
            onPickerValueChange={(itemValue, itemIndex) =>
              this.setState({ topicCategory: itemValue })
            }
            pickerSelectedValue={this.state.topicCategory}
            onSubmitPress={this.onTopicSubmit.bind(this)}
            onClosePress={() => this.setState({ showForm: false })}
          />
        </View>
      );
    }

    return null;
  };

  renderMarkers() {
    // const { currentUser } = firebase.auth();
    // firebase.database().ref(`users/${currentUser.uid}/topics`)
    //   .on('value', snapshot => {
    //     snapshot.val()
    //   });

    return markers.map((marker, i) => {
      var topic = marker.topic;
      return (
        <MapView.Marker key={marker.id} coordinate={marker.coordinate}>
          <CustomMarker topic={topic} backgroundColor={TopicType[topic]} />
        </MapView.Marker>
      );
    });
  }

  animateToCurrentLocation = async () => {
    this.setState({ showPin: false });
    this._map.animateToRegion(
      {
        latitude: this.state.userRegion.latitude,
        longitude: this.state.userRegion.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      2000
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView
          ref={component => {
            this._map = component;
          }}
          showsUserLocation
          followsUserLocation
          showsMyLocationButton={false}
          style={styles.MapStyle}
          region={this.state.mapRegion}
          onRegionChangeComplete={this.onRegionChange.bind(this)}
          onPress={() => this.setState({ showForm: false })}
        >
          {this.renderMarkers()}
          {this.renderDumpMarker()}
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
          <MyLocationButton onPress={() => this.animateToCurrentLocation()} />
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
    justifyContent: 'center'
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
