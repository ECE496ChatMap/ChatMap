import firebase from 'firebase';
import FCM from 'react-native-fcm';
import {
  CHAT_MESSAGE_CHANGE,
  CHAT_MESSAGE_SENDING,
  CHAT_MESSAGE_LOAD_SUCCESS,
  CHAT_MESSAGE_LOAD_ERROR,
  CHAT_MESSAGE_SEND_SUCCESS,
  CHAT_MESSAGE_SEND_ERROR,
  CHAT_HISTORY_LOAD_SUCCESS,
  CHAT_ROOM_LOAD_SUCCESS
} from './types';

const msg_limit = 20;

export const loadChatHistory = userID => {
  return dispatch => {
    firebase
      .database()
      .ref('chathistory/' + userID)
      .on(
        'child_added',
        snapshot => loadHistorySuccess(dispatch, snapshot.val(), snapshot.key),
        errorObject => loadHistoryError(dispatch, errorObject.message)
      );
  };
};

export const loadChatRoom = (roomID, chatroomName) => {
  return {
    type: CHAT_ROOM_LOAD_SUCCESS,
    key: roomID
  };
};

export const loadMessages = roomID => {
  return dispatch => {
    firebase
      .database()
      .ref('chatrooms/' + roomID)
      .limitToLast(msg_limit)
      .on(
        'child_added',
        snapshot => loadMsgSuccess(dispatch, snapshot.val(), roomID),
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
    //console.log('unloadfinished');
  };
};

export const updatemessage = text => {
  return {
    type: CHAT_MESSAGE_CHANGE,
    payload: text
  };
};

export const sendMessage = (message, roomID) => {
  return dispatch => {
    //dispatch({ type: CHAT_MESSAGE_SENDING });
    //console.log(message);
    var msgref = firebase
      .database()
      .ref('chatrooms/' + roomID)
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

const loadHistorySuccess = (dispatch, histvalue, histkey) => {
  dispatch({
    type: CHAT_HISTORY_LOAD_SUCCESS,
    payload: histvalue,
    key: histkey
  });
  dispatch(loadMessages(histkey));
};

const loadHistoryError = (dispatch, err) => {
  console.log(err);
};

const loadMsgSuccess = (dispatch, msgs, roomID) => {
  //console.log(msgs);
  // convert hashmap to array
  // let messages = [];
  // for (let key in msgs) {
  //   messages.push(msgs[key]);
  // }
  // console.log(messages);
  // FCM.presentLocalNotification({
  //   id: new Date().valueOf().toString(), // (optional for instant notification)
  //   title: 'Test Notification with action', // as FCM payload
  //   body: 'Force touch to reply', // as FCM payload (required)
  //   sound: 'bell.mp3', // "default" or filename
  //   priority: 'high', // as FCM payload
  //   click_action: 'com.myapp.MyCategory', // as FCM payload - this is used as category identifier on iOS.
  //   badge: 10, // as FCM payload IOS only, set 0 to clear badges
  //   number: 10, // Android only
  //   ticker: 'My Notification Ticker', // Android only
  //   auto_cancel: true, // Android only (default true)
  //   large_icon:
  //     'https://image.freepik.com/free-icon/small-boy-cartoon_318-38077.jpg', // Android only
  //   icon: 'ic_launcher', // as FCM payload, you can relace this with custom icon you put in mipmap
  //   big_text: 'Show when notification is expanded', // Android only
  //   sub_text: 'This is a subText', // Android only
  //   color: 'red', // Android only
  //   vibrate: 300, // Android only default: 300, no vibration if you pass 0
  //   wake_screen: true, // Android only, wake up screen when notification arrives
  //   group: 'group', // Android only
  //   picture: 'https://google.png', // Android only bigPicture style
  //   ongoing: true, // Android only
  //   my_custom_data: 'my_custom_field_value', // extra data you want to throw
  //   lights: true, // Android only, LED blinking (default false)
  //   show_in_foreground: true // notification when app is in foreground (local & remote)
  // });
  dispatch({
    type: CHAT_MESSAGE_LOAD_SUCCESS,
    payload: msgs,
    key: roomID
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
