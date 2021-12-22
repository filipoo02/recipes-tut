import { createAction, props } from '@ngrx/store';
export interface LoginAction {
  email: string;
  id: string;
  token: string;
  expiratonDate: Date;
  redirect: boolean;
}
export const login = createAction('[Auth] Login', props<LoginAction>());
export const startLogin = createAction(
  '[Auth] Start Login',
  props<{
    email: string;
    password: string;
  }>()
);
export const signup = createAction(
  '[Auth] Singup',
  props<{
    email: string;
    password: string;
  }>()
);

export const loginFail = createAction(
  '[Auth] Logn Fail',
  props<{ message: string }>()
);

export const clearError = createAction('[Auth] Clear Error');

export const logout = createAction('[Auth] Logout');

export const autoLogin = createAction('[Auth] Auto Login');
