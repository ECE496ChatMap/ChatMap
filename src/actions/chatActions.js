import firebase from 'firebase';
import {
  CHAT_MESSAGE_CHANGE,
  CHAT_MESSAGE_SENDING,
  CHAT_MESSAGE_LOAD_SUCCESS,
  CHAT_MESSAGE_LOAD_ERROR,
  CHAT_MESSAGE_SEND_SUCCESS,
  CHAT_MESSAGE_SEND_ERROR
} from './types';

const msg_limit = 20;

export const loadMessages = () => {
  return dispatch => {
    firebase
      .database()
      .ref('Messages')
      .limitToLast(msg_limit)
      .on(
        'child_added',
        snapshot => loadMsgSuccess(dispatch, snapshot.val()),
        errorObject => loadMsgError(dispatch, errorObject.message)
      );
  };
};

export const unloadMessages = () => {
  return dispatch => {
    firebase
      .database()
      .ref('Messages')
      .off('child_added');
    console.log('unloadfinished');
  };
};

export const updatemessage = text => {
  return {
    type: CHAT_MESSAGE_CHANGE,
    payload: text
  };
};

export const sendMessage = message => {
  return dispatch => {
    //dispatch({ type: CHAT_MESSAGE_SENDING });
    //console.log(message);
    var msgref = firebase
      .database()
      .ref('Messages')
      .push();
    message[0]._id = msgref.key;
    message[0].createdAt = firebase.database.ServerValue.TIMESTAMP;
    msgref.set(message[0], error => {
      if (error) {
        sendMsgError(dispatch, error.message);
      } else {
        sendMsgSuccess(dispatch);
      }
    });
  };
};

const loadMsgSuccess = (dispatch, msgs) => {
  //console.log(msgs);
  //convert hashmap to array
  //let messages = [];
  // for (let key in msgs) {
  //   messages.push(msgs[key]);
  // }
  //console.log(messages);
  dispatch({
    type: CHAT_MESSAGE_LOAD_SUCCESS,
    payload: msgs
  });
};

const loadMsgError = (dispatch, err) => {
  dispatch({
    type: CHAT_MESSAGE_LOAD_ERROR,
    payload: err
  });
};

const sendMsgError = (dispatch, err) => {
  dispatch({
    type: CHAT_MESSAGE_SEND_ERROR,
    payload: err
  });
};

const sendMsgSuccess = dispatch => {
  dispatch({
    type: CHAT_MESSAGE_SEND_SUCCESS
  });
};
