import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { exhaustMap, map, Observable, take } from 'rxjs';
import { AuthService } from './auth.service';
import * as fromApp from '../store/app.reducer';
import * as AuthAction from './store/auth.actions';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.store.select('auth').pipe(
      take(1),
      map((storeData) => storeData.user),
      exhaustMap((user) => {
        if (!user) return next.handle(req);

        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', user.token),
        });
        console.log(modifiedReq);
        return next.handle(modifiedReq);
      })
    );
  }
}
