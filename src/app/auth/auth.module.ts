import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthComponent } from './auth.component';

const authRoutes: Routes = [{ path: 'auth', component: AuthComponent }];

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
    CommonModule,
    RouterModule.forChild(authRoutes),
  ],
  declarations: [AuthComponent],
  exports: [FormsModule, CommonModule],
})
export class AuthModule {}
