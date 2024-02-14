import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { User } from './models';
import { UsereditformComponent } from './components/usereditfrom/usereditform.component';
import { UsersService } from './users.service';
import { UserdetailmodalComponent } from './components/userdetailmodal/userdetailmodal.component';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  accordionEnabled: boolean = true;
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  panelOpenState = false;
  displayedColumns: string[] = ['idUser', 'fullName', 'email', 'role', 'actions'];
  users: User[] = [];
  userForm: FormGroup;
  passwordAcceptable: boolean = false;

  constructor(private UsersService: UsersService, private dialog: MatDialog, private cdr: ChangeDetectorRef, private fb: FormBuilder, private http: HttpClient) {
    this.loadUsers();

    this.userForm = this.fb.group({
      firstName: this.fb.control("", Validators.required),
      lastName: this.fb.control("", Validators.required),
      email: this.fb.control("", [Validators.required, Validators.email]),
      password: this.fb.control("", [Validators.required, this.passwordValidator]),
      role: this.fb.control("", Validators.required),
      dni: this.fb.control("", Validators.required),
      birth: this.fb.control("", Validators.required),
    });

    const passwordControl = this.userForm.get('password');
    if (passwordControl) {
      passwordControl.valueChanges.subscribe(() => {
        this.passwordAcceptable = this.isPasswordAcceptable();
      });
    }
  }

  loadUsers(): void {
    this.UsersService.getUsers().subscribe(
      (users) => {
        this.users = users;
      }
    );
  }

  passwordValidator(control: AbstractControl | null): ValidationErrors | null {
    if (!control) {
      return null;
    }
    const value = control.value;
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const isValid = hasLetter && hasNumber;
  
    return isValid ? null : { invalidPassword: true };
  }

  isEmailInvalid(): boolean {
    const emailControl = this.userForm.get('email');
    return !!emailControl && emailControl.touched && emailControl.hasError('email');
  }
  
  isPasswordInvalid(): boolean {
    const passwordControl = this.userForm.get('password');
    return !!passwordControl && passwordControl.touched && passwordControl.hasError('invalidPassword');
  }
  
  isPasswordAcceptable() {
    const passwordControl = this.userForm.get('password');
    return !!passwordControl && passwordControl.valid && this.passwordValidator(passwordControl) === null;
  }
  
  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
    } else {
      this.http.post<User>('http://localhost:3000/users', this.userForm.value).subscribe(
      newUser => {
        this.users.push(newUser);
        this.loadUsers();
        this.dialog.closeAll();
        if (this.accordion && typeof this.accordion.closeAll === 'function') {
          this.accordion.closeAll();
          this.accordionEnabled = true; 
          this.cdr.detectChanges();
        }
        Swal.fire('Usuario agregado', 'El usuario ha sido agregado correctamente.', 'success');
      },
      error => {
        console.error('Error al guardar el usuario:', error);
        Swal.fire('Error', 'Hubo un error al guardar el usuario.', 'error');
      }
    );
  }
}
  
editUser(course: User) {
  const dialogRef = this.dialog.open(UsereditformComponent, {
    width: '400px',
    data: course
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.updateCourse(result);
      this.loadUsers();
    }
  });
}

private updateCourse(updatedUsers: User) {
  const updateUserObservable = this.UsersService.updateUser(updatedUsers);
  if (updateUserObservable) {
    updateUserObservable.subscribe(
      () => {
        const index = this.users.findIndex(users => users.id === updatedUsers.id);
        if (index !== -1) {
          this.users[index] = updatedUsers;
          Swal.fire('Usuario actualizado', 'El usuario ha sido actualizado correctamente.', 'success');
        }
      },
      error => {
        console.error('Error al actualizar el usuario:', error);
        Swal.fire('Error', 'Hubo un error al actualizar el usuario.', 'error');
      }
    );
  } else {
    console.error('Observable de updateUser es undefined');
  }
}


  mostrarDetallesModal(usuario: User): void {
    const dialogRef = this.dialog.open(UserdetailmodalComponent, {
      width: '400px',
      data: { userId: usuario.id } 
    });
  }
  
  
  deleteUser(userId: number): void {
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
        this.UsersService.deleteUser(userId).subscribe(
          () => {
            this.users = this.users.filter(user => user.idUser !== userId);
            this.loadUsers();
            Swal.fire(
              '¡Eliminado!',
              'El usuario ha sido eliminado.',
              'success'
            );
          },
          error => {
            console.error('Error al eliminar el usuario:', error);
            Swal.fire('Error', 'Hubo un error al eliminar el usuario.', 'error');
          }
        );
      }
    });
  }  
  
  
}
