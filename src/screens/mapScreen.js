import React, { Component } from 'react';
import {
  View,
  Alert,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text
} from 'react-native';
import MapView from 'react-native-maps';
import RNGooglePlaces from 'react-native-google-places';
import firebase from 'firebase';

import {
  SearchButton,
  CustomMarker,
  MapInput,
  IssueButton,
  IssueForm
} from '../components';

const screen = Dimensions.get('window');
const WINDOW_HEIGHT = screen.height;
const WINDOW_WIDTH = screen.width;
const ASPECT_RATIO = WINDOW_WIDTH / WINDOW_HEIGHT;
const LATITUDE = 43.6608;
const LONGITUDE = -79.3955;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const FORM_WIDTH = WINDOW_WIDTH - 40;
const FORM_HEIGHT = WINDOW_HEIGHT - 200;

class MapScreen extends Component {
  static navigationOptions = {
    title: 'Map',
    header: null
  };

  state = {
    region: {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    },
    showForm: false,
    topicContent: '',
    topicCategory: 'Music'
  };

  componentDidMount() {
    this.getCurrentPosition();
    this.watchPosition();
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  getCurrentPosition() {
    try {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.setState({
            region: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA
            }
          });
        },
        error => {
          // console.log(error);
          switch (error.code) {
            case 1:
              Alert.alert('', 'Error get current position');
              break;
            default:
              Alert.alert('', 'Default Error get current position');
          }
        }
      );
    } catch (e) {
      Alert.alert(e.message || '');
    }
  }

  watchPosition() {
    this.watchID = navigator.geolocation.watchPosition(position => {
      this.setState({
        region: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }
      });
    });
  }

  openSearchModal() {
    RNGooglePlaces.openAutocompleteModal()
      .then(place => {
        // console.log(place);
        // place represents user's selection from the
        // suggestions and it is a simplified Google Place object.
        this.setState({
          region: {
            latitude: place.latitude,
            longitude: place.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }
        });
      })
      .catch(error => console.log(error.message)); // error is a Javascript Error object
  }

  renderSearchButton() {
    return (
      <View style={styles.searchView}>
        <SearchButton onPress={() => this.openSearchModal()}>
          <Text>Explore your surrounding</Text>
        </SearchButton>
      </View>
    );
  }

  onTopicSubmit = () => {
    const { topicContent, topicCategory, region } = this.state;
    var d = new Date();
    var currentTime = d.toUTCString();

    const { currentUser } = firebase.auth();
    firebase
      .database()
      .ref(`users/${currentUser.uid}/topics`)
      .push({ topicContent, topicCategory, region, currentTime });
    this.setState({ showForm: false });
  };

  renderIssueForm() {
    if (this.state.showForm) {
      var formWidth = WINDOW_WIDTH - 40;
      var formHeight = WINDOW_HEIGHT - 200;

      return (
        <View style={styles.issueFormStyle}>
          <IssueForm
            onContentChange={text => this.setState({ topicContent: text })}
            onPickerValueChange={(itemValue, itemIndex) =>
              this.setState({ topicCategory: itemValue })
            }
            pickerSelectedValue={this.state.topicCategory}
            onSubmitPress={this.onTopicSubmit.bind(this)}
          />
        </View>
      );
    }

    return null;
  }

  onIssueButtonPress = () => {
    this.setState({ showForm: !this.state.showForm });
  };

  renderIssueButton() {
    return <IssueButton onPress={this.onIssueButtonPress} />;
  }

  renderMarkers() {
    // const { currentUser } = firebase.auth();
    // firebase.database().ref(`users/${currentUser.uid}/topics`)
    //   .on('value', snapshot => {
    //     snapshot.val()
    //   });
    return <CustomMarker coordinate={this.state.region} />;
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          showsUserLocation
          followsUserLocation
          style={styles.MapStyle}
          region={this.state.region}
          onRegionChange={this.onRegionChange.bind(this)}
          onRegionChangeComplete={this.onRegionChange.bind(this)}
        >
          {this.renderMarkers()}
        </MapView>
        {this.renderSearchButton()}
        {this.renderIssueForm()}
        {this.renderIssueButton()}
      </View>
    );
  }
}

const styles = {
  MapStyle: {
    height: WINDOW_HEIGHT,
    width: WINDOW_WIDTH,
    ...StyleSheet.absoluteFillObject
  },
  container: {
    flexDirection: 'column',
    flex: 1
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
    height: FORM_HEIGHT,
    width: FORM_WIDTH,
    zIndex: 100,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    alignItems: 'center'
  }
};

export default MapScreen;
