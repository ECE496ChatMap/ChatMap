import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import AppNavigation from './src/navigation';
import * as firebase from 'firebase';
import 'firebase/functions';

export default class App extends Component {
  componentWillMount() {
    const config = {
      apiKey: 'AIzaSyA7gd1d6FL0rLVC5Ttb2rfNXSsnxcRab2I',
      authDomain: 'chat-map-f390a.firebaseapp.com',
      databaseURL: 'https://chat-map-f390a.firebaseio.com',
      projectId: 'chat-map-f390a',
      storageBucket: 'chat-map-f390a.appspot.com',
      messagingSenderId: '340017396713'
    };
    firebase.initializeApp(config);
  }

  render() {
    return (
      <Provider store={store}>
        <AppNavigation />
      </Provider>
    );
  }
}
