import { createAction, props } from '@ngrx/store';
import { Recipe } from '../recipe.model';

export const setRecipes = createAction(
  '[Recipes] Set Recipes',
  props<{ recipes: Recipe[] }>()
);

export const addRecipe = createAction(
  '[Recipes] Add Recipe',
  props<{ recipe: Recipe }>()
);

export const updateRecipe = createAction(
  '[Recipes] Update Recipe',
  props<{ newRecipe: Recipe; index: number }>()
);

export const deleteRecipe = createAction(
  '[Recipes] Delete Recipe',
  props<{ index: number }>()
);

export const storeRecipes = createAction('[Recipes] Store Recipes');

export const fetchRecipes = createAction('[Recipes] Fetch Recipes');
