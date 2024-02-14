import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../models';

@Component({
  selector: 'app-usereditform',
  templateUrl: './usereditform.component.html',
  styleUrls: ['./usereditform.component.scss']
})
export class UsereditformComponent implements OnInit {
  @Output() edited = new EventEmitter<User>(); 

  userForm!: FormGroup; 

  constructor(
    private dialogRef: MatDialogRef<UsereditformComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: [this.data.firstName, Validators.required],
      lastName: [this.data.lastName, Validators.required],
      email: [this.data.email, [Validators.required, Validators.email]],
      password: [this.data.password, Validators.required],
      role: [this.data.role, Validators.required],
      dni: [this.data.dni, Validators.required],
      birth: [this.data.birth, Validators.required], 
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
  
    const updatedUser: User = {
      ...this.data,
      ...this.userForm.value
    };
  
    this.dialogRef.close(updatedUser);
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }
}
