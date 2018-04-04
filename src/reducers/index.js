import { combineReducers } from 'redux';
import navigationReducer from './navigationReducer';
import authReducer from './authReducer';
import regReducer from './regReducer';
import chatroomReducer from './chatroomReducer';
import chatlistReducer from './chatlistReducer';
import { LOGOUT_USER_SUCCESS } from '../actions/types';

const reducer = combineReducers({
  navigationReducer,
  authReducer,
  regReducer,
  chatroomReducer,
  chatlistReducer
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT_USER_SUCCESS) {
    state = undefined;
  }
  return reducer(state, action);
};

export default rootReducer;
