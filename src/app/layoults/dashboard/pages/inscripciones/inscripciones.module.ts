import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InscripcionesComponent } from './inscripciones.component';
import { InscripcionEditFormComponent } from './components/inscripcion-edit-form/inscripcion-edit-form.component';
import { InscripcionDetailModalComponent } from './components/inscripcion-detail-modal/inscripcion-detail-modal.component';
import { InscripcionesService } from './inscripciones.service';
import { SharedModule } from '../../../../shared/shared.module';


@NgModule({
  declarations: [
    InscripcionesComponent,
    InscripcionEditFormComponent,
    InscripcionDetailModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    InscripcionesComponent,
  ],
  providers: [
    InscripcionesService,
  ],
})
export class InscripcionesModule { }
