import { Injectable } from "@angular/core";
import { User } from "../users/models";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";

@Injectable()
export class UsersService {
  constructor(private httpClient: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>('http://localhost:3000/users');
  }

  addUser(newUser: User): Observable<User> {
    return this.httpClient.post<User>('http://localhost:3000/users', newUser);
  }

  deleteUser(userId: number): Observable<void> {
    return this.httpClient.delete<void>(`http://localhost:3000/users/${userId}`);
  }
  
  getUserById(userId: number): Observable<User> {
    return this.httpClient.get<User>(`http://localhost:3000/users/${userId}`);
  }

  updateUser(updatedUsers: User): Observable<User> {
    return this.httpClient.put<User>(`http://localhost:3000/users/${updatedUsers.id}`, updatedUsers);
  }

  findUserByRegistrationInfo(firstName: string, lastName: string, email: string): Observable<User | undefined> {
    return this.httpClient.get<User[]>('http://localhost:3000/users').pipe(
      map(users => users.find(user => 
        user.firstName === firstName && 
        user.lastName === lastName && 
        user.email === email
      ))
    );
  }

 
}