import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthData, AuthResponseData, AuthService } from './auth.service';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  @ViewChild('loginForm') loginForm: NgForm;
  isLogginMode = true;
  isLoading = false;
  error: string = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.store.select('auth').subscribe((actionData) => {
      this.error = actionData.authError;
      this.isLoading = actionData.loading;
    });
  }

  onClose() {
    this.store.dispatch(AuthActions.clearError());
  }

  switchLogginMode() {
    this.isLogginMode = !this.isLogginMode;
  }

  onSubmitForm() {
    let authObs: Observable<AuthResponseData>;

    const formValues = this.loginForm.value as AuthData;

    if (this.isLogginMode)
      this.store.dispatch(
        AuthActions.startLogin({
          email: formValues.email,
          password: formValues.password,
        })
      );
    // authObs = this.authService.login(this.loginForm.value);
    else
      this.store.dispatch(
        AuthActions.signup({
          email: formValues.email,
          password: formValues.password,
        })
      );
    // else authObs = this.authService.signup(this.loginForm.value);

    // authObs.subscribe(
    //   (res) => {
    //     this.isLoading = false;
    //     this.router.navigate(['/recipes']);
    //     console.log(res);
    //   },
    //   (err) => {
    //     this.isLoading = false;
    //     this.error = err;
    //     console.log(err);
    //   }
    // );
  }
}
