import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { UsersModule } from './pages/users/users.module';
import { PipesModule } from './pages/pipes/pipes.module';
import { HomeModule } from './pages/home/home.module';
import { CursosModule } from './pages/cursos/cursos.module';
import { InscripcionesModule } from './pages/inscripciones/inscripciones.module';
import { SharedModule } from '../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    UsersModule,
    PipesModule,
    HomeModule,
    CursosModule,
    InscripcionesModule,
    DashboardRoutingModule,
  ],
  exports: [
    DashboardComponent,
  ],
  providers: [
    DatePipe, 
  ],
})
export class DashboardModule { }