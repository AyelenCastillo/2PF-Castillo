import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { Course } from "./models";

@Injectable()
export class CursosService {

  constructor(private httpClient: HttpClient) {}

  getCourse(): Observable<Course[]> {
    return this.httpClient.get<Course[]>('http://localhost:3000/courses');
  }

  addCourse(newCourse: Course): Observable<Course> {
    return this.httpClient.post<Course>('http://localhost:3000/courses', newCourse);
  }

  deleteCourse(courseId: number): Observable<Course> {
    return this.httpClient.delete<Course>(`http://localhost:3000/courses/${courseId}`);
  }

  getCourseById(courseId: number): Observable<Course> {
    return this.httpClient.get<Course>(`http://localhost:3000/courses/${courseId}`);
  }  
  updateCourse(updatedCourse: Course): Observable<Course> {
    return this.httpClient.put<Course>(`http://localhost:3000/courses/${updatedCourse.id}`, updatedCourse);
  }

  findCourseByRegistrationInfo(name: string): Observable<Course | undefined> {
    return this.httpClient.get<Course[]>('http://localhost:3000/courses').pipe(
      map(courses => courses.find(courses => 
        courses.name === name 
      ))
    );
  }
  
}
