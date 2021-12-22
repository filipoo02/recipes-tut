import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs';
import { Recipe } from '../recipe.model';

import * as RecipesActions from '../store/recipes.actions';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class RecipesEffects {
  URL = 'https://recipe-book-angular-f381b-default-rtdb.firebaseio.com/';

  storeRecipes = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RecipesActions.storeRecipes),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([recipesActions, recipes]) => {
          console.log(recipes);
          return this.http.put(`${this.URL}/recipes.json`, recipes.recipes);
        })
      ),
    { dispatch: false }
  );

  fetchRecipes = createEffect(() => {
    return this.actions$.pipe(
      ofType(RecipesActions.fetchRecipes),
      switchMap(() =>
        this.http.get<Recipe[]>(
          `https://recipe-book-angular-f381b-default-rtdb.firebaseio.com/recipes.json`
        )
      ),
      map((recipes) => {
        // console.log(recipes.recipes);
        if (!recipes) return null;
        return recipes.map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      map((recipes) => {
        if (recipes) return RecipesActions.setRecipes({ recipes });
        return { type: 'DUMMY' };
      })
    );
  });

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
