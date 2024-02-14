import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Registration } from "./models/index";



@Injectable()


export class InscripcionesService {
  constructor(private httpClient: HttpClient) {}

  getRegistration(): Observable<Registration[]> {
    return this.httpClient.get<Registration[]>('http://localhost:3000/registrations');
  }

  addRegistration(newRegistration: Registration): Observable<Registration> {
    return this.httpClient.post<Registration>('http://localhost:3000/registrations', newRegistration);
  }

  deleteRegistration(registrationId: number): Observable<Registration> {
    return this.httpClient.delete<Registration>(`http://localhost:3000/registrations/${registrationId}`);
  }

  getRegistrationById(registrationId: number): Observable<Registration> {
    return this.httpClient.get<Registration>(`http://localhost:3000/registrations/${registrationId}`);
  }  

  updateRegistration(updateRegistration: Registration): Observable<Registration> {
    return this.httpClient.put<Registration>(`http://localhost:3000/registrations/${updateRegistration.id}`, updateRegistration);
  }

}
