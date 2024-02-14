import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './layoults/error/error.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './layoults/dashboard/dashboard.component';


const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [authGuard],
    component: DashboardComponent,
    loadChildren: () =>
    import('./layoults/dashboard/dashboard.module').then(
      (m) => m.DashboardModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
    import('./layoults/auth/auth.module').then(
      (m) => m.AuthModule),
  },
  {
    path: '',
    redirectTo: 'auth', pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '404',
  },
  {
    path: '404',
    component: ErrorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
