import { combineReducers } from 'redux';
import navigationReducer from './navigationReducer';
import authReducer from './authReducer';
import regReducer from './regReducer';
import chatReducer from './chatReducer';
import { LOGOUT_USER_SUCCESS } from '../actions/types';

const reducer = combineReducers({
  navigationReducer,
  authReducer,
  regReducer,
  chatReducer
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT_USER_SUCCESS) {
    state = undefined;
  }
  return reducer(state, action);
};

export default rootReducer;
