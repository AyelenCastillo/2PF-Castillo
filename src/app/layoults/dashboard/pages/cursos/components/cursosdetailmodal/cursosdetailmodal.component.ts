import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Course } from '../../models';
import { CursosService } from '../../cursos.service';

@Component({
  selector: 'app-cursosdetailmodal',
  templateUrl: './cursosdetailmodal.component.html',
  styleUrls: ['./cursosdetailmodal.component.scss']
})
export class CursosdetailmodalComponent {
  course: Course | undefined;

  constructor(
    public dialogRef: MatDialogRef<CursosdetailmodalComponent>,
    private cursosService: CursosService,
    @Inject(MAT_DIALOG_DATA) public data: { courseId: number }
  ) {}

  ngOnInit(): void {
    const courseId = this.data.courseId;
    if (courseId !== undefined) {
      this.cursosService.getCourseById(courseId).subscribe(
        (course) => {
          this.course = course;
        },
        (error) => {
          console.error('Error al obtener el curso:', error);
        }
      );
    }
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
