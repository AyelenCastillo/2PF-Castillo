import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Course } from './models';
import { CursosService } from './cursos.service';
import { HttpClient } from '@angular/common/http';
import { CursosformeditComponent } from './components/cursosformedit/cursosformedit.component';
import { CursosdetailmodalComponent } from './components/cursosdetailmodal/cursosdetailmodal.component';
import { DatePipe } from '@angular/common';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.scss'],
})

export class CursosComponent {
  accordionEnabled: boolean = true;
  @ViewChild(MatAccordion) accordion!: MatAccordion;


  panelOpenState = false;
  displayedColumns: string[] = ['id', 'name','date','hours','start','end','actions'];
  courses: Course[] = [];
  courseForm: FormGroup;

  constructor(
    private cursosService: CursosService,
    private dialog: MatDialog, 
    private cdr: ChangeDetectorRef, 
    private fb: FormBuilder, 
    private http: HttpClient,
    private datePipe: DatePipe
  ) {
    this.loadCourses();
    this.courseForm = this.fb.group({
      name: this.fb.control("", Validators.required),
      date: this.fb.control("", Validators.required),
      hours: this.fb.control("", Validators.required),
      start: this.fb.control("", Validators.required),
      end: this.fb.control("", Validators.required),
      description: this.fb.control("", Validators.required),
    });
  }

  formatFecha(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0'); 
    return `${day}-${month}-${year}`;
  }

  loadCourses(): void {
    this.cursosService.getCourse().subscribe(
      (courses) => {
        this.courses = courses.map(course => ({
          ...course,
          start: this.formatFecha(new Date(course.start)), 
          end: this.formatFecha(new Date(course.end))
        }));
        this.cdr.detectChanges();
      }
    );
  }

  onSubmit(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
    } else {
      const formData = this.courseForm.value;
      let startDate = new Date(formData.start);
      let endDate = new Date(formData.end);
  
      if (startDate.getTime() === endDate.getTime()) {
        endDate.setDate(endDate.getDate() + 1);
      }
  
      formData.start = this.formatFecha(startDate);
      formData.end = this.formatFecha(endDate);
  
      this.http.post<Course>('http://localhost:3000/courses', formData).subscribe(
        () => {
          this.courses.push(formData);
          this.loadCourses();
  
          if (this.accordion && typeof this.accordion.closeAll === 'function') {
            this.accordion.closeAll();
            this.accordionEnabled = true; 
            this.courseForm.reset();
            this.courseForm.markAsUntouched(); 
            this.cdr.detectChanges();
          }
          
          Swal.fire('Curso agregado', 'El curso ha sido agregado correctamente.', 'success');
        },
        error => {
          console.error('Error al guardar el curso:', error);
          Swal.fire('Error', 'Hubo un error al guardar el curso.', 'error');
        }
      );
    }
  }
  
  
  

  deleteCourse(courseId: number): void {
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
        this.cursosService.deleteCourse(courseId).subscribe(
          () => {
            this.courses = this.courses.filter(course => course.idCourse !== courseId);
            this.loadCourses();
            Swal.fire(
              '¡Eliminado!',
              'El Curso ha sido eliminado.',
              'success'
            );
          },
          error => {
            console.error('Error al eliminar el curso:', error);
            Swal.fire('Error', 'Hubo un error al eliminar el curso.', 'error');
          }
        );
      }
    });
  }

  editCourse(course: Course) {
    const dialogRef = this.dialog.open(CursosformeditComponent, {
      width: '400px',
      data: course
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateCourse(result);
        this.loadCourses();
      }
    });
  }

  private updateCourse(updatedCourse: Course) {
    this.cursosService.updateCourse(updatedCourse).subscribe(
      () => {
        const index = this.courses.findIndex(course => course.id === updatedCourse.id);
        if (index !== -1) {
          this.courses[index] = updatedCourse;
          Swal.fire('Curso actualizado', 'El curso ha sido actualizado correctamente.', 'success');
        }
      },
      error => {
        console.error('Error al actualizar el curso:', error);
        Swal.fire('Error', 'Hubo un error al actualizar el curso.', 'error');
      }
    );
  }

  mostrarDetallesModal(course: Course): void {
    const dialogRef = this.dialog.open(CursosdetailmodalComponent, {
      width: '400px',
      data: { courseId: course.id }
    });
  }

}
