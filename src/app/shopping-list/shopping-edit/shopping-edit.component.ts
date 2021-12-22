import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: true }) shoppingForm: NgForm;
  subscription: Subscription;
  editItemIndex: number;
  editMode = false;
  editingItem: Ingredient;

  constructor(
    private shoppingService: ShoppingListService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.store.select('shoppingList').subscribe((stateData) => {
      if (stateData.editingIndex > -1) {
        this.editMode = true;
        this.editItemIndex = stateData.editingIndex;
        this.editingItem = stateData.editingIngredient;
        this.shoppingForm.setValue({
          name: this.editingItem.name,
          amount: this.editingItem.amount,
        });
      } else {
        this.editMode = false;
      }
    });
    // this.subscription = this.shoppingService.ingredientEditable.subscribe(
    //   (index: number) => {
    //     this.editItemIndex = index;
    //     this.editMode = true;
    //     this.editingItem = this.shoppingService.getIngredient(index);
    //     this.shoppingForm.setValue(this.editingItem);
    //   }
    // );
  }

  onSubmitForm(form: NgForm) {
    const newIngredient = new Ingredient(form.value.name, form.value.amount);

    if (!this.editMode)
      this.store.dispatch(
        ShoppingListActions.addIngredient({ ingredient: newIngredient })
      );
    // if (!this.editMode) this.shoppingService.addIngredient(form.value);
    if (this.editMode)
      this.store.dispatch(
        ShoppingListActions.updateIngredient({
          ingredient: newIngredient,
        })
      );
    // this.shoppingService.updateIngredient(this.editItemIndex, form.value);

    this.clearForm();
  }

  onDelete() {
    this.store.dispatch(ShoppingListActions.deleteIngredient());
    this.clearForm();
    // this.shoppingService.deleteIngredient(this.editItemIndex);
  }

  clearForm() {
    this.shoppingForm.reset();
    this.editMode = false;
    this.store.dispatch(ShoppingListActions.stopEdit());
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
    this.store.dispatch(ShoppingListActions.stopEdit());
  }
}
