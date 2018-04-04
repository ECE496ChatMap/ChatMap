import {
  CHAT_MESSAGE_CHANGE,
  CHAT_MESSAGE_SENDING,
  CHAT_MESSAGE_LOAD_SUCCESS,
  CHAT_MESSAGE_LOAD_ERROR,
  CHAT_MESSAGE_SEND_SUCCESS,
  CHAT_MESSAGE_SEND_ERROR,
  CHAT_ROOM_LOAD_SUCCESS,
  CHAT_HISTORY_LOAD_SUCCESS
} from '../actions/types';
import { GiftedChat } from 'react-native-gifted-chat';

const initState = {
  sending: false,
  sendError: '',
  messages: [],
  loadError: '',
  currentRoomID: null,
  allmessages: {}
};

const chatroomReducer = (state = initState, action) => {
  //console.log(action.type);
  //console.log(action.payload);
  switch (action.type) {
    case CHAT_HISTORY_LOAD_SUCCESS: {
      state.allmessages[action.key] = [];
      return state;
    }
    case CHAT_ROOM_LOAD_SUCCESS:
      return {
        ...state,
        messages: state.allmessages[action.key],
        currentRoomID: action.key
      };
    // case CHAT_MESSAGE_SENDING:
    //   return { ...state, sending: true, sendError: null };
    case CHAT_MESSAGE_SEND_ERROR:
      return { ...state, sending: false, sendError: action.payload };
    case CHAT_MESSAGE_SEND_SUCCESS:
      return {
        ...state,
        sending: false,
        sendError: null
      };
    // case CHAT_MESSAGE_CHANGE:
    //   return {
    //     ...state,
    //     sending: false,
    //     text: action.payload,
    //     sendError: null
    //   };
    case CHAT_MESSAGE_LOAD_SUCCESS:
      state.allmessages[action.key] = GiftedChat.append(
        state.allmessages[action.key],
        action.payload
      );
      if (state.allmessages[action.key].length > 20) {
        state.allmessages[action.key].shift();
      }
      if (state.currentRoomID === action.key) {
        return {
          ...state,
          messages: GiftedChat.append(state.messages, action.payload),
          loadError: null
        };
      } else {
        return state;
      }
    case CHAT_MESSAGE_LOAD_ERROR:
      return { ...state, loadError: action.payload };
    default:
      return state;
  }
};

export default chatroomReducer;
