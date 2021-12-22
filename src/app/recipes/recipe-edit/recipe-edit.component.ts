import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipes.actions';
import { map, switchMap } from 'rxjs';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit {
  recipeForm: FormGroup;
  editMode = false;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  get controles() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  onAddIngredients() {
    (this.recipeForm.get('ingredients') as FormArray).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params.id * 1;
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      this.store
        .select('recipes')
        .pipe(
          map((recipesState) =>
            recipesState.recipes.find((r, index) => index === this.id)
          )
        )
        .subscribe((recipe) => {
          recipeName = recipe.name;
          recipeImagePath = recipe.imagePath;
          recipeDescription = recipe.description;

          if (recipe.ingredients)
            recipe.ingredients.forEach((ing) => {
              recipeIngredients.push(
                new FormGroup({
                  name: new FormControl(ing.name, Validators.required),
                  amount: new FormControl(ing.amount, [
                    Validators.required,
                    Validators.pattern(/^[1-9]+[0-9]*$/),
                  ]),
                })
              );
            });
        });
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients,
    });
  }

  onSubmit() {
    if (this.editMode) {
      // update
      // this.recipeService.updateRecipe(this.id, this.recipeForm.value);
      this.store.dispatch(
        RecipesActions.updateRecipe({
          newRecipe: this.recipeForm.value,
          index: this.id,
        })
      );
    } else {
      const v = this.recipeForm.value;
      const recipe: Recipe = new Recipe(
        v.name,
        v.description,
        v.imagePath,
        v.ingredients
      );
      this.store.dispatch(
        RecipesActions.addRecipe({ recipe: this.recipeForm.value })
      );
      // this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  onCancel() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  onDeleteIng(index: number) {
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
  }
}
