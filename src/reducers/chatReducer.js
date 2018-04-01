import {
  CHAT_MESSAGE_CHANGE,
  CHAT_MESSAGE_SENDING,
  CHAT_MESSAGE_LOAD_SUCCESS,
  CHAT_MESSAGE_LOAD_ERROR,
  CHAT_MESSAGE_SEND_SUCCESS,
  CHAT_MESSAGE_SEND_ERROR
} from '../actions/types';
import { GiftedChat } from 'react-native-gifted-chat';

const initState = {
  sending: false,
  sendError: '',
  messages: [],
  loadError: ''
};

const chatReducer = (state = initState, action) => {
  console.log(action.type);
  //console.log(action.payload);
  switch (action.type) {
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
      return {
        ...state,
        messages: GiftedChat.append(state.messages, action.payload),
        loadError: null
      };
    case CHAT_MESSAGE_LOAD_ERROR:
      return { ...state, loadError: action.payload };
    default:
      return state;
  }
};

export default chatReducer;
