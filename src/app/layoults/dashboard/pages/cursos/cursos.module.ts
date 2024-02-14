import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CursosComponent } from './cursos.component';
import { CursosService } from './cursos.service'; 
import { SharedModule } from '../../../../shared/shared.module';
import { CursosdetailmodalComponent } from './components/cursosdetailmodal/cursosdetailmodal.component';
import { CursosformeditComponent } from './components/cursosformedit/cursosformedit.component';

@NgModule({
  declarations: [
    CursosComponent,
    CursosdetailmodalComponent,
    CursosformeditComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    CursosComponent,
  ],
  providers: [
    CursosService, 
  ],
})
export class CursosModule { }
