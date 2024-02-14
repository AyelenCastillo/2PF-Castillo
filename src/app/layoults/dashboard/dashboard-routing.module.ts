import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CursosComponent } from "./pages/cursos/cursos.component";
import { UsersComponent } from "./pages/users/users.component";
import { InscripcionesComponent } from "./pages/inscripciones/inscripciones.component";
import { HomeComponent } from "./pages/home/home.component";
import { adminauthGuard } from "../../guards/admin-auth.guard";

const routes: Routes = [
    {
      path: 'users',
      canActivate: [adminauthGuard],
      component:UsersComponent,
 
    },
    {
    path: 'cursos',
    canActivate: [adminauthGuard],
     component:CursosComponent,
    },
    {
      path:'home',
      component:HomeComponent,
    },
    {
      path: 'inscripciones',
      canActivate: [adminauthGuard],
      component:InscripcionesComponent
    },
    { 
        path: "",
        redirectTo: "dashboard/home", pathMatch: "prefix" 
    },
    {
      path: 'dashboard',
      redirectTo: 'dashboard/home', pathMatch: 'full',
    },
]
@NgModule({
imports: [ RouterModule.forChild(routes)],
exports: [RouterModule,]
})

export class DashboardRoutingModule {}