import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../src/reducers';
import { checksession } from '../src/actions/authActions';
import firebase from 'firebase';

export function configureStore() {
  const store = createStore(reducer, {}, compose(applyMiddleware(thunk)));
  const config = {
    apiKey: 'AIzaSyA7gd1d6FL0rLVC5Ttb2rfNXSsnxcRab2I',
    authDomain: 'chat-map-f390a.firebaseapp.com',
    databaseURL: 'https://chat-map-f390a.firebaseio.com',
    projectId: 'chat-map-f390a',
    storageBucket: 'chat-map-f390a.appspot.com',
    messagingSenderId: '340017396713'
  };
  firebase.initializeApp(config);
  store.dispatch(checksession());
  return store;
}
