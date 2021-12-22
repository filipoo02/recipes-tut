import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from '../auth/auth.service';
import * as fromApp from '../store/app.reducer';
import * as AuthAction from '../auth/store/auth.actions';
import * as RecipesActions from '../recipes/store/recipes.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.store
      .select('auth')
      .subscribe((storeData) => (this.isAuthenticated = !!storeData.user));
  }

  onSaveData() {
    // this.dataStorage.storeRecipes();
    this.store.dispatch(RecipesActions.storeRecipes());
  }

  onLogout() {
    this.store.dispatch(AuthAction.logout());
  }

  onFetchData() {
    this.store.dispatch(RecipesActions.fetchRecipes());
    // this.dataStorage.fetchRecipes().subscribe();
  }
}
