import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { InscripcionesService } from './inscripciones.service';
import { InscripcionEditFormComponent } from './components/inscripcion-edit-form/inscripcion-edit-form.component';
import { InscripcionDetailModalComponent } from './components/inscripcion-detail-modal/inscripcion-detail-modal.component';
import { MatAccordion } from '@angular/material/expansion';
import { Registration } from './models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CursosService } from '../cursos/cursos.service';

@Component({
  selector: 'app-inscripciones',
  templateUrl: './inscripciones.component.html',
  styleUrls: ['./inscripciones.component.scss']
})
export class InscripcionesComponent {
  accordionEnabled: boolean = true;
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  panelOpenState = false;
  displayedColumns: string[] = ['id', 'fullName', 'email', 'curso','schedule', 'actions'];
  registration: Registration[] = [];
  registrationForm: FormGroup;
  courses: any[] = []; 
  users: any[] = [];
  selectedCourseSchedule: { date: string, hours: string } = { date: '', hours: '' };

  constructor(
    private inscripcionesService: InscripcionesService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private http: HttpClient,
    private cursosService: CursosService
  ) {
    this.loadRegistration();

    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      course: ['', Validators.required],
      schedule: [''] 
    });

    this.loadUsers();
  }

  ngOnInit(): void {
    this.cursosService.getCourse().subscribe(courses => {
      this.courses = courses;
    });
  }

  loadUsers(): void {
    this.http.get<any[]>('http://localhost:3000/users').subscribe(
      users => {
        this.users = users;
      },
      error => {
        console.error('Error al cargar usuarios:', error);
      }
    );
  }

  loadRegistration(): void {
    this.inscripcionesService.getRegistration().subscribe(
      (registration) => {
        this.registration = registration;
      }
    );
  }

  isEmailInvalid(): boolean {
    const emailControl = this.registrationForm.get('email');
    return !!emailControl && emailControl.touched && emailControl.hasError('email');
  }

  onCourseSelectionChange(courseName: string): void {
    const selectedCourse = this.courses.find(course => course.name === courseName);
    if (selectedCourse) {
      if (selectedCourse.hours && typeof selectedCourse.hours === 'string') {
        const hoursRange = selectedCourse.hours.split(' - ');
        const startHour = hoursRange[0];
        const endHour = hoursRange[1];
        this.selectedCourseSchedule = { date: selectedCourse.date, hours: selectedCourse.hours };
      } else {
        this.selectedCourseSchedule = { date: selectedCourse.date, hours: '' };
      }
    } else {
      this.selectedCourseSchedule = { date: '', hours: '' };
    }
  }
  

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    const formData = this.registrationForm.value;

    const existingRegistration = this.registration.find(registration =>
      registration.firstName === formData.firstName &&
      registration.lastName === formData.lastName &&
      registration.email === formData.email
    );

    if (existingRegistration) {
      Swal.fire('Error', 'Ya existe una inscripción con los mismos datos de usuario.', 'error');
      return;
    }

    this.http.post<Registration>('http://localhost:3000/registrations', formData).subscribe(
      newRegistration => {
        this.registration.push(newRegistration);
        this.loadRegistration();
        this.dialog.closeAll();
        if (this.accordion && typeof this.accordion.closeAll === 'function') {
          this.accordion.closeAll();
        }
        Swal.fire('Inscripción Exitosa', 'Los datos se han cargado correctamente', 'success');
        this.registrationForm.reset(); 
      },
      error => {
        Swal.fire('Error', 'Hubo un error al guardar la inscripción.', 'error');
      }
    );
  }

  editRegistration(registration: Registration) {
    const dialogRef = this.dialog.open(InscripcionEditFormComponent, {
      width: '400px',
      data: registration,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateRegistration(result);
        this.loadRegistration();
      }
    });
  }

  private updateRegistration(updateRegistration: Registration) {
    this.inscripcionesService.updateRegistration(updateRegistration).subscribe(
      () => {
        const index = this.registration.findIndex(registration => registration.id === updateRegistration.id);
        if (index !== -1) {
          this.registration[index] = updateRegistration;
          Swal.fire('Inscripción actualizada', 'Ha sido actualizado correctamente.', 'success');
        }
      },
      error => {
        console.error('Error al actualizar:', error);
        Swal.fire('Error', 'Hubo un error al actualizar.', 'error');
      }
    );
  }

  mostrarDetallesModal(registration: Registration): void {
    const dialogRef = this.dialog.open(InscripcionDetailModalComponent, {
      width: '400px',
      data: { registrationId: registration.id } 
    });
  }

  deleteRegistration(RegistrationId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.inscripcionesService.deleteRegistration(RegistrationId).subscribe(
          () => {
            this.registration = this.registration.filter(registration => registration.id !== RegistrationId);
            this.loadRegistration();
            Swal.fire(
              '¡Eliminado!',
              'El Registro ha sido eliminado.',
              'success'
            );
          },
          error => {
            console.error('Error al eliminar el Registro:', error);
            Swal.fire('Error', 'Hubo un error al eliminar el registro.', 'error');
          }
        );
      }
    });
  }
}
