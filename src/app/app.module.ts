import { LOCALE_ID, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { DashboardModule } from './layoults/dashboard/dashboard.module';
import es from "@angular/common/locales/es";
import { registerLocaleData } from '@angular/common';
import { CursosModule } from './layoults/dashboard/pages/cursos/cursos.module';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { DashboardRoutingModule } from './layoults/dashboard/dashboard-routing.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

registerLocaleData(es);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    SharedModule,
    DashboardModule,
    CursosModule,
    AppRoutingModule,
    HttpClientModule,
    DashboardRoutingModule,
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'es-AR',
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
