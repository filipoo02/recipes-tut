import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { Recipe } from '../recipe.model';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipes.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipeDetail: Recipe;
  id: number;

  constructor(
    private shoppingService: ShoppingListService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((params) => params.id),
        switchMap((id) => {
          this.id = +id;
          return this.store.select('recipes');
        }),
        map((recipesState) =>
          recipesState.recipes.find((r, index) => index === this.id)
        )
      )
      .subscribe((recipe) => (this.recipeDetail = recipe));

    // this.route.params.subscribe((param: Params) => {
    //   this.id = param.id * 1;
    // });
  }

  addToShoppingList() {
    // this.recipeDetail.ingredients.forEach((ing) => {
    //   this.shoppingService.addIngredient(ing);
    // });
    this.store.dispatch(
      ShoppingListActions.addIngredients({
        ingredients: this.recipeDetail.ingredients,
      })
    );
    // this.shoppingService.addIngredients(this.recipeDetail.ingredients);
  }

  deleteRecipe() {
    this.store.dispatch(RecipesActions.deleteRecipe({ index: this.id }));
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
