import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../models';
import { UsersService } from '../../users.service';

@Component({
  selector: 'app-userdetailmodal',
  templateUrl: './userdetailmodal.component.html',
  styleUrls: ['./userdetailmodal.component.scss']
})
export class UserdetailmodalComponent implements OnInit {
  usuario: User | undefined; 

  constructor(
    public dialogRef: MatDialogRef<UserdetailmodalComponent>,
    private usersService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number }
  ) {}

  ngOnInit(): void {
    const courseId = this.data.userId;
    if (courseId !== undefined) {
      this.usersService.getUserById(courseId).subscribe(
        (usuario) => {
          this.usuario = usuario;
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
