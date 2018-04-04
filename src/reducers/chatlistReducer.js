import firebase from 'firebase';
import {
  CHAT_MESSAGE_LOAD_SUCCESS,
  CHAT_HISTORY_LOAD_SUCCESS
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
          time: action.payload.createAt
        })
      };
    case CHAT_MESSAGE_LOAD_SUCCESS:
      let i = state.list.findIndex(o => o.key === action.key);
      console.log(state.list);
      console.log(action.payload);
      console.log(i);
      state.list[i].subtitle = action.payload.text;
      state.list[i].time = action.payload.createdAt;
      // if (i > 0) {
      //   let temp = state.list.splice(i, 1);
      //   state.list.unshift(temp);
      // }
      return {
        ...state,
        list: state.list.slice(0).sort((a, b) => a.time - b.time)
      };
    default:
      return state;
  }
};

export default chatlistReducer;
