import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { ShoppingListComponent } from './shopping-list.component';

const shoppingRoutes: Routes = [{ path: '', component: ShoppingListComponent }];

@NgModule({
  imports: [
    RouterModule.forChild(shoppingRoutes),
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
  ],
  declarations: [ShoppingListComponent, ShoppingEditComponent],
  exports: [ShoppingListComponent, ShoppingEditComponent],
})
export class ShoppingListModule {}
