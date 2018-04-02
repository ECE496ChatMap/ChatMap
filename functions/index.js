// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.readPosts = functions.https.onCall((data, context) => {
  var userId = firebase.auth().currentUser.uid;

  return firebase.database().ref('posts').once('value').then(snapshot => {
    // filter the data?
    const RANGE = data.range;
    const MAP_REGION = data.mapRegion;

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

      // distance = distanceInKmBetweenEarthCoordinates(MAP_REGION.latitude,
      //                                                MAP_REGION.longitude,
      //                                                myTopic.coordinate.latitude,
      //                                                myTopic.coordinate.longitude);
      // if (distance <= RANGE) {
      //   curMarkers.push(myTopic);
      //   topicId++;
      // }
      curMarkers.push(myTopic);
    }

    return {readPosts: curMarkers};
  });

});

function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(lat2-lat1);
  var dLon = degreesToRadians(lon2-lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return earthRadiusKm * c;
}

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}
