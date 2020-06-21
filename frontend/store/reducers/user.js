import { userActionTypes } from '../actions/user';

const initialState = null;

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case userActionTypes.LOGIN_SUCCESS:
    case userActionTypes.FETCH_USER_SUCCESS:
      return action.user;
    case userActionTypes.LOGOUT_SUCCESS:
      return null;
    default:
      return state;
  }
}