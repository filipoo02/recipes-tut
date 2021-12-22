import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import * as fromApp from '../store/app.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit {
  ingSubChanged: Subscription;

  ingredients: Observable<{ ingredients: Ingredient[] }>;
  name: string;
  amount: number;

  constructor(
    private shoppingService: ShoppingListService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
    // this.ingredients = this.shoppingService.getIngredients();
    // this.ingSubChanged = this.shoppingService.ingredientChanged.subscribe(
    //   (ings: Ingredient[]) => (this.ingredients = ings)
    // );
  }

  onIngAdded(event: Ingredient) {
    // this.ingredients.push(new Ingredient(event.name, event.amount));
  }

  onEditItem(index: number) {
    this.store.dispatch(ShoppingListActions.startEdit({ index }));
    // this.shoppingService.ingredientEditable.next(index);
  }

  // ngOnDestroy(): void {
  //   this.ingSubChanged.unsubscribe();
  // }
}
