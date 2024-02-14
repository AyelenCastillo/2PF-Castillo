import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Course } from '../../models';

@Component({
  selector: 'app-cursosformedit',
  templateUrl: './cursosformedit.component.html',
  styleUrls: ['./cursosformedit.component.scss']
})
export class CursosformeditComponent {
  @Output() edited = new EventEmitter<Course>(); 

  cursosForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<CursosformeditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Course,
    private fb: FormBuilder
  ) {
    this.cursosForm = this.fb.group({
      name: [data.name, Validators.required],
      date: [data.date, Validators.required],
      hours: [data.hours, [Validators.required]],
      start: [this.parseDate(data.start), [Validators.required]],
      end: [this.parseDate(data.end), [Validators.required]],
      description: [data.description, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.cursosForm.invalid) {
      this.cursosForm.markAllAsTouched();
      return;
    }
  
    const updatedCourse: Course = {
      ...this.data,
      ...this.cursosForm.value
    };
  
    this.dialogRef.close(updatedCourse);
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }

  private parseDate(dateString: string | Date | null): Date | null {
    if (!dateString) {
      return null;
    }
    if (typeof dateString === 'string') {
      return new Date(dateString);
    }
    if (dateString instanceof Date) {
      return dateString;
    }
    return null;
  }
}
