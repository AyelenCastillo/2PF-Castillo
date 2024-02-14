import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsersService } from './users.service';
import { User } from '../users/models';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService]
    });
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('addUser', () => {
    expect(service).toBeTruthy();
  });

  it('deleteUser', () => {
    const userId = 1;

    service.deleteUser(userId).subscribe(() => {
      expect().nothing(); 
    });

    const req = httpMock.expectOne(`http://localhost:3000/users/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('getUserById', () => {
    const userId = 1;
    const mockUser: User = {
      idUser: userId,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password',
      role: 'user'
    };

    service.getUserById(userId).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`http://localhost:3000/users/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('updateUser', () => {
    const updatedUser: User = {
      idUser: 1,
      firstName: 'Updated',
      lastName: 'User',
      email: 'updated@example.com',
      password: 'updatedPassword',
      role: 'admin'
    };

    service.updateUser(updatedUser).subscribe(user => {
      expect(user).toEqual(updatedUser);
    });

    const req = httpMock.expectOne(`http://localhost:3000/users/${updatedUser.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedUser);
    req.flush(updatedUser);
  });

  it('findUserByRegistrationInfo', () => {
    const firstName = 'John';
    const lastName = 'Doe';
    const email = 'john@example.com';
    const mockUsers: User[] = [
      {
        idUser: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password',
        role: 'user'
      }
    ];

    service.findUserByRegistrationInfo(firstName, lastName, email).subscribe(user => {
      expect(user).toEqual(mockUsers[0]);
    });

    const req = httpMock.expectOne('http://localhost:3000/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
  
});
