import firebase from 'firebase';
import {
  CHAT_MESSAGE_LOAD_SUCCESS,
  CHAT_HISTORY_LOAD_SUCCESS,
  CHAT_ROOM_LOAD_SUCCESS
} from '../actions/types';
import { GiftedChat } from 'react-native-gifted-chat';

const initState = {
  list: []
};

const chatlistReducer = (state = initState, action) => {
  //console.log(action);
  switch (action.type) {
    case CHAT_HISTORY_LOAD_SUCCESS:
      return {
        ...state,
        list: GiftedChat.append(state.list, {
          key: action.key,
          title: action.payload.content,
          time: action.payload.createAt,
          lastAccess: action.payload.lastaccess,
          isUpdated: false
        })
      };
    case CHAT_MESSAGE_LOAD_SUCCESS:
      let i = state.list.findIndex(o => o.key === action.key);
      console.log(state.list);
      console.log(action.payload);
      console.log(state.list[i].time);
      console.log(state.list[i].lastAccess);
      state.list[i].subtitle = action.payload.text;
      state.list[i].time = action.payload.createdAt;
      if (state.list[i].time > state.list[i].lastAcsess) {
        state.list[i].isUpdated = true;
      }
      return {
        ...state,
        list: state.list.slice(0).sort((a, b) => b.time - a.time)
      };
    case CHAT_ROOM_LOAD_SUCCESS:
      let j = state.list.findIndex(o => o.key === action.key);
      state.list[j].lastAccess = action.accessTime;
      return {
        ...state,
        list: state.list.slice(0)
      };
    default:
      return state;
  }
};

export default chatlistReducer;
