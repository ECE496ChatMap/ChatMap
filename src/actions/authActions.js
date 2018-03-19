import {
  LOGIN_EMAIL_CHANGED,
  LOGIN_PASSWORD_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER_START,
  LOGOUT_USER_START,
  LOGOUT_USER_SUCCESS,
  LOGOUT_USER_FAIL,
  CHECKING_SESSION_START,
  CHECKING_SESSION_FAIL,
  NAVIGATE_TO_REG
} from './types';
import { loadMessages, unloadMessages } from './chatActions';
import firebase from 'firebase';

export const navtoReg = () => {
  return { type: NAVIGATE_TO_REG };
};

export const loginemailChanged = text => {
  return {
    type: LOGIN_EMAIL_CHANGED,
    payload: text
  };
};

export const loginpasswordChanged = text => {
  return {
    type: LOGIN_PASSWORD_CHANGED,
    payload: text
  };
};

export const loginUser = ({ loginemail, loginpassword }) => {
  return dispatch => {
    dispatch({ type: LOGIN_USER_START });

    firebase
      .auth()
      .signInWithEmailAndPassword(loginemail, loginpassword)
      .catch(error => loginUserFail(dispatch, error));
  };
};

export const checksession = () => {
  return dispatch => {
    dispatch({ type: CHECKING_SESSION_START });

    firebase.auth().onAuthStateChanged(user => {
      user
        ? loginUserSuccess(dispatch, user)
        : dispatch({ type: CHECKING_SESSION_FAIL });
    });
  };
};

export const logoutUser = () => {
  return dispatch => {
    dispatch({ type: LOGOUT_USER_START });

    firebase
      .auth()
      .signOut()
      .then(user => logoutUserSuccess(dispatch, user))
      .catch(() => logoutUserFail(dispatch));
  };
};

const loginUserSuccess = (dispatch, user) => {
  dispatch(loadMessages());
  dispatch({
    type: LOGIN_USER_SUCCESS,
    payload: user
  });
};

const loginUserFail = (dispatch, error) => {
  dispatch({
    type: LOGIN_USER_FAIL,
    payload: error
  });
};

const logoutUserSuccess = (dispatch, user) => {
  dispatch(unloadMessages());
  dispatch({
    type: LOGOUT_USER_SUCCESS,
    payload: user
  });
};

const logoutUserFail = dispatch => {
  dispatch({ type: LOGOUT_USER_FAIL });
};
