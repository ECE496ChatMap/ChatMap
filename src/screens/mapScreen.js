import React, { Component } from 'react';
import {
  View,
  Alert,
  Dimensions,
  Text,
  Animated,
  Slider
} from 'react-native';
import MapView from 'react-native-maps';
import RNGooglePlaces from 'react-native-google-places';
import * as firebase from 'firebase';

import {
  SearchButton,
  CustomMarker,
  IssueButton,
  IssueForm,
  MyLocationButton,
  FilterButton,
  TopicFilter,
  ToListButton,
  PinMarker
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

const FORM_HEIGHT = (WINDOW_HEIGHT - 150) * 0.9;
const FILTER_HEIGHT = 150;

const MARKER_LATITUDE = 43.6466495;
const MARKER_LONGITUDE = -79.3759458;

var isIssueFormHidden = true;
var isFilterHidden = true;

class MapScreen extends Component {
  static navigationOptions = {
    title: 'Map',
    header: null
  };

  _map = null;

  constructor() {
    super();
    this.allPosts = null;
    this.selectedCategory = 'All';
    this.pinCoord = null;
    this.curUserProfile = {
      name: 'Anonymous',
      bio: 'You don\'t have a bio yet.',
      pic: require('../assets/images/dummyProfile.png')
    };
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
      topicContent: '',
      topicCategory: '',
      topicDuration: '',
      newTopic: {
        category: null,
        content: null,
        coordinates: null
      },
      showPin: false,
      filteredPosts: null,
      bounceValue: new Animated.Value(-WINDOW_HEIGHT),
      filterBounceValue: new Animated.Value(FILTER_HEIGHT),
      showFilter: false,
      displayRange: 0.1
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

    // query current user's info
    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
      var curUser = snapshot.val();
      console.log('check curUser');
      console.log(curUser);
      if (curUser.hasOwnProperty('profile')) {
        if (curUser.profile.name !== null &&
            curUser.profile.name !== '') {
          this.curUserProfile.name = curUser.profile.name;
        }
        if (curUser.profile.bio !== null &&
            curUser.profile.bio !== '') {
          this.curUserProfile.bio = curUser.profile.bio;
        }
      }
    });

    console.log(this.curUserProfile);

    // listen to markers data,
    // update allPosts whenever a new post is created in database
    var topicsRef = firebase.database().ref('posts');
    topicsRef.on('value', function(snapshot) {
      var allTopics = snapshot.val();
      var postsFromDB = {};
      for (var topicKey in allTopics) {
        var curTopic = allTopics[topicKey];
        var myTopic = {
          key: topicKey,
          category: curTopic.category,
          content: curTopic.content,
          issuer: curTopic.issuer,
          timestamp: curTopic.timestamp,
          duration: curTopic.durationInHr,
          coordinate: {
            latitude: curTopic.region.latitude,
            longitude: curTopic.region.longitude
          }
        };
        postsFromDB[topicKey] = myTopic;
      }

      this.allPosts = postsFromDB;
      this.filterPosts('All');
    }.bind(this));
  }

  // if user choose a specific category, then save those posts of the same
  // category to this.state.filteredPosts.
  // We also save a reference to all posts to this.allPosts
  filterPosts(filteredCategory) {
    this.selectedCategory = filteredCategory;

    var filteredPosts = [];
    if (filteredCategory !== 'All') {
      for (var key in this.allPosts) {
        var post = this.allPosts[key];

        // first filter incoming posts by selected category
        if (post.category === filteredCategory) {
          // then check if this post is within display range
          var d = this.distanceInKmBetweenEarthCoordinates(this.state.mapRegion, post.coordinate);
          if (d <= this.state.displayRange) {
            filteredPosts.push(post);
          }
        }
      }
    }
    else {
      for (var key in this.allPosts) {
        var post = this.allPosts[key];
        var d = this.distanceInKmBetweenEarthCoordinates(this.state.mapRegion, post.coordinate);
        if (d <= this.state.displayRange) {
          filteredPosts.push(post);
        }
      }
    }

    this.setState({filteredPosts: filteredPosts});

    if (!isFilterHidden) {
      this.toggleFilter(false);
    }
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);

    // detach listener
    firebase.database().ref('posts').off();
  }

  onRegionChangeComplete(region) {
    this.setState({ mapRegion: region });

    const { currentUser } = firebase.auth();
    var updates = {};
    updates['/users/' + currentUser.uid + '/focusedRegion'] = this.state.mapRegion;
    firebase.database().ref().update(updates);

    // var disInKm = this.distanceInKmBetweenEarthCoordinates(this.state.userRegion, this.state.mapRegion);
    // if (disInKm > 0.010) {
    //   this.setState({showPin: true});
    // }
    // else {
    //   this.setState({showPin: false});
    // }

    this.filterPosts(this.selectedCategory);
  }

  distanceInKmBetweenEarthCoordinates(region1, region2) {
    var lat1 = region1.latitude;
    var lon1 = region1.longitude;
    var lat2 = region2.latitude;
    var lon2 = region2.longitude;

    var earthRadiusKm = 6371;

    var dLat = this.degreesToRadians(lat2 - lat1);
    var dLon = this.degreesToRadians(lon2 - lon1);

    lat1 = this.degreesToRadians(lat1);
    lat2 = this.degreesToRadians(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }

  degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  openSearchModal() {
    RNGooglePlaces.openAutocompleteModal()
      .then(place => {
        // place represents user's selection from the
        // suggestions and it is a simplified Google Place object.
        this.pinCoord = {
          latitude: place.latitude,
          longitude: place.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        };
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
    const { topicContent, topicCategory, topicDuration, mapRegion } = this.state;

    // validate the submit data
    if (topicContent === '') {
      Alert.alert(
        'Fail to Submit',
        'Post content cannot be empty'
      );
      return;
    }
    if (topicCategory === '' || topicCategory === 'Choose your topic') {
      Alert.alert(
        'Fail to Submit',
        'A category of the post must be selected'
      );
      return;
    }

    var currentTime = Date.now();

    const { currentUser } = firebase.auth();

    var topicData = {
      issuer: currentUser.uid,
      category: topicCategory,
      content: topicContent,
      region: mapRegion,
      timestamp: currentTime,
      durationInHr: topicDuration
    };

    var newTopicKey = firebase.database().ref().child('posts').push().key;

    var updates = {};
    updates['/users/' + currentUser.uid + '/posts/' + newTopicKey] = true;
    updates['/posts/' + newTopicKey] = topicData;
    updates['/categories/' + topicCategory + '/' + newTopicKey] = true;
    updates['/chatrooms/' + newTopicKey + '/issuer'] = currentUser.uid;

    firebase.database().ref().update(updates);

    this.setState({
      showPin: false
    });

    this.toggleIssueForm(false);
  };

  renderPin(region) {
    if (this.state.showPin) {
      return (
        <MapView.Marker
          draggable
          coordinate={this.pinCoord}
          onDragEnd={e => this.onPinMarkerDragEnd(e)}
        >
          <PinMarker
            backgroundColor={'#FF5722'}
          />
        </MapView.Marker>
      );
    }
    else {
      return null;
    }
  }

  onPinMarkerDragEnd(e) {
    var coord = {
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
      latitudeDelta: this.state.mapRegion.latitudeDelta,
      longitudeDelta: this.state.mapRegion.longitudeDelta
    };

    this._map.animateToRegion(coord, 2000);
  }

  renderMarkers() {
    if (this.state.filteredPosts === null) {
      return null;
    }
    else {
      return (
        this.state.filteredPosts.map((post, i) => {
          var cate = post.category;
          return (
            <MapView.Marker
              key={post.key}
              coordinate={post.coordinate}
              onPress={() => this.props.navigation.navigate('postDetail', {
                post: this.allPosts[post.key]
              })}
            >
              <CustomMarker
                topic={cate}
                backgroundColor={TopicType[cate]}
              />
            </MapView.Marker>
          );
        })
      );
    }
  }

  renderCircle() {
    var radius = this.state.displayRange * 1000;
    return (
      <MapView.Circle
        center={this.state.mapRegion}
        radius={radius}
        strokeColor={'rgba(100,181,246,0.5)'}
        fillColor={'rgba(100,181,246,0.15)'}
      />
    );
  }

  toggleIssueForm(isMapTapped) {
    this.setState({
      topicContent: '',
      topicCategory: '',
      topicDuration: ''
    });

    if (isMapTapped && isIssueFormHidden) {
      return;
    }

    var toValue = -WINDOW_HEIGHT;
    if (isIssueFormHidden) {
      toValue = -(WINDOW_HEIGHT - FORM_HEIGHT - 200);
    }

    Animated.spring(
      this.state.bounceValue,
      {
        toValue: toValue,
        velocity: 3,
        tension: 2,
        friction: 8
      }
    ).start();

    isIssueFormHidden = !isIssueFormHidden;
  }

  toggleFilter(isMapTapped) {
    if (isMapTapped && isFilterHidden) {
      return;
    }

    var toValue = FILTER_HEIGHT;
    if (isFilterHidden) {
      toValue = -125;
    }

    Animated.spring(
      this.state.filterBounceValue,
      {
        toValue: toValue,
        velocity: 3,
        tension: 2,
        friction: 8
      }
    ).start();

    isFilterHidden = !isFilterHidden;
  }

  animateToRegion = async (region) => {
    this.setState({ showPin: false });
    this._map.animateToRegion(
      {
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta
      },
      2000
    );
  };

  onMapPress() {

    this.toggleIssueForm(true);
    this.toggleFilter(true);
  }

  onMapLongPress(e) {
    console.log('---');
    console.log(e);
    var coord = e.nativeEvent.coordinate;
    this.pinCoord = {
      latitude: coord.latitude,
      longitude: coord.longitude,
      latitudeDelta: this.state.mapRegion.latitudeDelta,
      longitudeDelta: this.state.mapRegion.longitudeDelta
    };
    this.setState({showPin: true});

    this._map.animateToRegion(this.pinCoord, 2000);
  }

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
          onRegionChangeComplete={this.onRegionChangeComplete.bind(this)}
          onPress={() => this.onMapPress()}
          onLongPress={e => this.onMapLongPress(e)}
        >
          {this.renderMarkers()}
          {this.renderPin()}
          {this.renderCircle()}
        </MapView>

        <View style={styles.searchView}>
          <SearchButton onPress={() => this.openSearchModal()}>
            <Text>Explore your surrounding</Text>
          </SearchButton>
        </View>

        <Animated.View
          style={[styles.issueFormContainer,
            {transform: [{translateY: this.state.bounceValue}]}]}>
          <IssueForm
            style={styles.issueFormStyle}
            onContentChange={text => this.setState({ topicContent: text })}
            onPickerValueChange={(itemValue, itemIndex) => this.setState({ topicCategory: itemValue })}
            pickerSelectedValue={this.state.topicCategory}
            onSlidingComplete={val => this.setState({ topicDuration: val })}
            onSubmitPress={this.onTopicSubmit.bind(this)}
            onClosePress={() => this.toggleIssueForm(false)}
            userProfile={this.curUserProfile}
          />
        </Animated.View>

        <Animated.View
          style={[styles.filterContainer,
            {transform: [{translateY: this.state.filterBounceValue}]}]}>
          <TopicFilter
            style={styles.issueFormStyle}
            onPickerValueChange={(itemValue, itemIndex) => this.filterPosts(itemValue) }
            pickerSelectedValue={this.selectedCategory}
            onClosePress={() => this.toggleFilter(false)}
          />
        </Animated.View>

        <View style={styles.sliderSectionContainer}>
          <View style={{width: 50}}>
            <Text>{parseFloat(this.state.displayRange).toFixed(1)} Km</Text>
          </View>

          <View>
            <Slider
              style={{width: 230}}
              step={0.1}
              minimumValue={0.1}
              maximumValue={5}
              value={0.1}
              onValueChange={val => this.setState({ displayRange: val })}
              onSlidingComplete={() => this.filterPosts(this.selectedCategory)}
            />
          </View>
        </View>

        <View style={styles.ToListButton}>
          <ToListButton onPress={() => this.props.navigation.navigate('postList', {posts: this.state.filteredPosts})} />
        </View>

        <View style={styles.myLocationButton}>
          <MyLocationButton onPress={() => this.animateToRegion(this.state.userRegion)} />
        </View>

        <View style={styles.filterButton}>
          <FilterButton onPress={() => this.toggleFilter(false)} />
        </View>

        <IssueButton
          onPress={() => this.toggleIssueForm(false)}
        />
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
    zIndex: 0
  },
  searchView: {
    height: 50,
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 99,
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
  issueFormContainer: {
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
    height: FORM_HEIGHT,
    zIndex: 100
  },
  filterContainer: {
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
    height: FILTER_HEIGHT,
    zIndex: 100
  },
  ToListButton: {
    height: 33,
    width: 33,
    position: 'absolute',
    zIndex: 99,
    bottom: 285,
    right: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 10
  },
  myLocationButton: {
    height: 35,
    width: 35,
    position: 'absolute',
    zIndex: 99,
    bottom: 210,
    right: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 10
  },
  filterButton: {
    height: 35,
    width: 35,
    position: 'absolute',
    zIndex: 99,
    bottom: 135,
    right: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 10
  },
  sliderSectionContainer: {
    flexDirection: 'row',
    width: 280,
    height: 30,
    zIndex: 99,
    position: 'absolute',
    bottom: 35,
    left: 30,
    padding: 5,
    backgroundColor: 'transparent'
  }
};

export default MapScreen;
