import { createReducer, on } from '@ngrx/store';
import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
  ingredients: Ingredient[];
  editingIndex: number;
  editingIngredient: Ingredient;
}

const initialState: State = {
  ingredients: [new Ingredient('Apples', 6), new Ingredient('Tomatos', 10)],
  editingIndex: -1,
  editingIngredient: null,
};

export const shoppingListReducer = createReducer(
  initialState,
  on(ShoppingListActions.addIngredient, (state, action) => ({
    ...state,
    ingredients: [...state.ingredients, action.ingredient],
  })),
  on(ShoppingListActions.addIngredients, (state, action) => ({
    ...state,
    ingredients: [...state.ingredients, ...action.ingredients],
  })),
  on(ShoppingListActions.updateIngredient, (state, action) => ({
    ...state,
    ingredients: state.ingredients.map((ing, index) =>
      state.editingIndex === index ? action.ingredient : ing
    ),
  })),
  on(ShoppingListActions.startEdit, (state, action) => {
    console.log(state);
    console.log(action);
    return {
      ...state,
      editingIndex: action.index,
      editingIngredient: { ...state.ingredients[action.index] },
    };
  }),
  on(ShoppingListActions.deleteIngredient, (state, action) => {
    return {
      ...state,
      ingredients: state.ingredients.filter(
        (ing, index) => index !== state.editingIndex
      ),
    };
  }),
  on(ShoppingListActions.stopEdit, (state, action) => ({
    ...state,
    editingIndex: -1,
    editingIngredient: null,
  }))
);

// export function shoppingListReducer(
//   state = initialState,
//   action: ShoppingListActions.ShoppingListActions
// ) {
//   switch (action.type) {
//     case ShoppingListActions.ADD_INGREDIENT:
//       return { ...state, ingredients: [...state.ingredients, action.payload] };
//     case ShoppingListActions.ADD_INGREDIENTS:
//       return {
//         ...state,
//         ingredients: [...state.ingredients, ...action.payload],
//       };
//     default:
//       return state;
//   }
// }
