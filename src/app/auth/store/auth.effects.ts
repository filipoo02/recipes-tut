import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { act, Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';

const API_KEY = environment.API_KEY;

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthetication = (
  expiresIn: number,
  email: string,
  token: string,
  id: string
) => {
  const expiratonDate = new Date(new Date().getTime() + expiresIn * 1000);
  const newUser = new User(email, id, token, expiratonDate);
  localStorage.setItem('user', JSON.stringify(newUser));

  return {
    type: AuthActions.login.type,
    email,
    token,
    id,
    expiratonDate,
    redirect: true,
  };
};

const handleError = (errorResponse) => {
  let errorMessage = 'Something went wrong!';
  const errors = errorResponse?.error?.error?.errors;

  if (!errors) return of(AuthActions.loginFail({ message: errorMessage }));

  if (errors[0].message === 'EMAIL_EXISTS')
    errorMessage = 'The email address is already in use by another account.';

  if (errors[0].message === 'OPERATION_NOT_ALLOWED')
    errorMessage = 'Password sign-in is disabled for this project';

  if (
    errors[0].message === 'EMAIL_NOT_FOUND' ||
    errors[0].message === 'INVALID_PASSWORD'
  )
    errorMessage = 'Invalid email address or password.';
  return of(AuthActions.loginFail({ message: errorMessage }));
};

@Injectable()
export class AuthEffects {
  authSignup = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signup),
      switchMap((signupAction) =>
        this.http
          .post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
            {
              email: signupAction.email,
              password: signupAction.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            map((resData) => {
              this.authService.setLogoutTimer(+resData.expiresIn * 1000);
              return handleAuthetication(
                +resData.expiresIn,
                resData.email,
                resData.idToken,
                resData.localId
              );
            }),
            catchError((errorResponse) => handleError(errorResponse))
          )
      )
    )
  );

  authLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.startLogin),
      switchMap((actionData) => {
        return this.http
          .post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
            {
              email: actionData.email,
              password: actionData.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            map((resData) => {
              this.authService.setLogoutTimer(+resData.expiresIn * 1000);

              return handleAuthetication(
                +resData.expiresIn,
                resData.email,
                resData.idToken,
                resData.localId
              );
            }),
            catchError((errorResponse) => handleError(errorResponse))
          );
      })
    )
  );

  authAutoLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoLogin),
      map(() => {
        const loginUser = JSON.parse(localStorage.getItem('user'));
        if (!loginUser) return { type: 'DUMMY' };
        // if (!loginUser) return this.userSubject.next(null);

        const user = new User(
          loginUser.email,
          loginUser.id,
          loginUser._token,
          new Date(loginUser._tokenExpirationDate)
        );

        const expiresIn =
          new Date(loginUser._tokenExpirationDate).getTime() -
          new Date().getTime();
        // this.autoLogout(expiresIn);

        this.authService.setLogoutTimer(expiresIn);

        if (user.token) {
          return AuthActions.login({
            email: loginUser.email,
            id: loginUser.id,
            token: loginUser._token,
            expiratonDate: new Date(loginUser._tokenExpirationDate),
            redirect: false,
          });
        } else return { type: 'DUMMY' };
      })
    )
  );

  authRedirect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.login),
        tap((action: AuthActions.LoginAction) => {
          if (action.redirect) this.router.navigate(['/']);

          //   return { type: AuthActions.logout };
        })
        // switchMap(() => of({ type: AuthActions.logout }))
      ),
    { dispatch: false }
  );

  authLogout = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem('user');
          this.router.navigate(['/auth']);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
