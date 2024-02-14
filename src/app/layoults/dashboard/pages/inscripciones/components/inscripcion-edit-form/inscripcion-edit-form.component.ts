import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Registration } from '../../models';
import { CursosService } from '../../../cursos/cursos.service';
import { InscripcionesService } from '../../inscripciones.service';

@Component({
  selector: 'app-inscripcion-edit-form',
  templateUrl: './inscripcion-edit-form.component.html',
  styleUrls: ['./inscripcion-edit-form.component.scss']
})
export class InscripcionEditFormComponent {
  @Output() edited = new EventEmitter<Registration>(); 
  courses: any[] = []; 
  users: any[] = []; 
  selectedCourseSchedule: { date: string, hours: string } = { date: '', hours: '' };
  registrationForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<InscripcionEditFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Registration,
    private cursosService: CursosService,
    private inscripcionesService: InscripcionesService,
    private fb: FormBuilder
  ) {
    this.registrationForm = this.fb.group({
      id: [data.id, Validators.required],
      firstName: [data.firstName, Validators.required],
      lastName: [data.lastName, Validators.required],
      email: [data.email, [Validators.required, Validators.email]],
      course: ['', Validators.required],
      schedule: ['']
    });
  }

  ngOnInit(): void {
    this.cursosService.getCourse().subscribe(courses => {
      this.courses = courses;
    });
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
    if (this.registrationForm.valid) {
      const formData = this.registrationForm.value;
      
      this.inscripcionesService.updateRegistration(formData).subscribe(
        (response: any) => {
          this.edited.emit(response);
          this.dialogRef.close(response);
        },
        (error: any) => {
          console.error('Error al actualizar la inscripción:', error);
        }
      );
    }
  }
  

  cerrarModal(): void {
    this.dialogRef.close();
  }
}
