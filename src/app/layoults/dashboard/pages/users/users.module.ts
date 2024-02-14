import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { UsereditformComponent } from './components/usereditfrom/usereditform.component';
import { UsersService } from './users.service';
import { UsersComponent } from './users.component';
import { UserdetailmodalComponent } from './components/userdetailmodal/userdetailmodal.component';


@NgModule({
  declarations: [
    UsersComponent,
    UsereditformComponent,
    UserdetailmodalComponent,
  ],
 
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    UsersComponent
  ],
  providers: [
    UsersService,
  ],
})
export class UsersModule { }
