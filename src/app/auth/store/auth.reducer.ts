import { createReducer, on } from '@ngrx/store';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User;
  authError: string;
  loading: boolean;
  redirect: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false,
  redirect: true,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state, action) => {
    const user = new User(
      action.email,
      action.id,
      action.token,
      action.expiratonDate
    );
    return {
      ...state,
      authError: null,
      user,
      loading: false,
    };
  }),
  on(AuthActions.startLogin, (state, action) => ({
    ...state,
    authError: null,
    loading: true,
  })),
  on(AuthActions.signup, (state, action) => ({
    ...state,
    authError: null,
    loading: true,
  })),
  on(AuthActions.logout, (state) => {
    return { ...state, user: null };
  }),
  on(AuthActions.clearError, (state) => {
    return { ...state, authError: null };
  }),
  on(AuthActions.autoLogin, (state, action) => {
    return { ...state };
  }),
  on(AuthActions.loginFail, (state, action) => ({
    ...state,
    authError: action.message,
    user: null,
    loading: false,
  }))
);
