import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Registration } from '../../models/index';
import { User } from '../../../users/models';
import { UsersService } from '../../../users/users.service';
import { InscripcionesService } from '../../inscripciones.service';
import { CursosService } from '../../../cursos/cursos.service';
import { Course } from '../../../cursos/models';

@Component({
  selector: 'app-inscripcion-detail-modal',
  templateUrl: './inscripcion-detail-modal.component.html',
  styleUrls: ['./inscripcion-detail-modal.component.scss']
})
export class InscripcionDetailModalComponent {
  registration: Registration | undefined;
  usuario: User | undefined;
  course:Course | undefined;

  constructor(
    public dialogRef: MatDialogRef<InscripcionDetailModalComponent>,
    private userService: UsersService,
    private inscripcionesService: InscripcionesService,
    private courseService: CursosService,
    @Inject(MAT_DIALOG_DATA) public data: { registrationId: number }
  ) {}


  ngOnInit(): void {
    const registrationId = this.data.registrationId;
    if (registrationId !== undefined) {
      this.inscripcionesService.getRegistrationById(registrationId).subscribe(
        (registration) => {
          this.registration = registration;
          if (registration) {
            this.userService.findUserByRegistrationInfo(registration.firstName, registration.lastName, registration.email).subscribe(
              (usuario) => {
                this.usuario = usuario;
              },
              (error) => {
                console.error('Error al obtener el usuario:', error);
              }
            );
          }
          if (registration) {
            this.courseService.findCourseByRegistrationInfo(registration.course).subscribe(
              (course) => {
                this.course = course;
              },
              (error) => {
                console.error('Error al obtener el usuario:', error);
              }
            );
          }
        },
        (error) => {
          console.error('Error al obtener la inscripción:', error);
        }
      );
    }
  }


  cerrar(): void {
    this.dialogRef.close();
  }
}
