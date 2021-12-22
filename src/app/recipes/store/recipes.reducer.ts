import { createReducer, on } from '@ngrx/store';
import { Recipe } from '../recipe.model';
import * as RecipesActions from './recipes.actions';

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: [],
};

export const recipesReducer = createReducer(
  initialState,
  on(RecipesActions.setRecipes, (state, action) => {
    return {
      ...state,
      recipes: [...action.recipes],
    };
  }),
  on(RecipesActions.fetchRecipes, (state) => {
    return { ...state };
  }),
  on(RecipesActions.addRecipe, (state, action) => {
    console.log('REDUCER ADD RECIPE');
    return {
      ...state,
      recipes: [...state.recipes, action.recipe],
    };
  }),
  on(RecipesActions.deleteRecipe, (state, action) => ({
    ...state,
    recipes: state.recipes.filter((r, i) => i !== action.index),
  })),
  on(RecipesActions.storeRecipes, (state) => ({ ...state })),
  on(RecipesActions.updateRecipe, (state, action) => {
    return {
      ...state,
      recipes: state.recipes.map((recipe, index) => {
        if (index === action.index) return action.newRecipe;
        else return recipe;
      }),
    };
  })
);
