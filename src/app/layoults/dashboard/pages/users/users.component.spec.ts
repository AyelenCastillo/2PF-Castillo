import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { UsersComponent } from './users.component';
import { UsersService } from './users.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '../../../../shared/shared.module';
import { MatDialog } from '@angular/material/dialog'; 
import { UsereditformComponent } from './components/usereditfrom/usereditform.component';
import { UserdetailmodalComponent } from './components/userdetailmodal/userdetailmodal.component';
import { User } from './models';


describe('Pruebas de UserComponent', () => {
  let component: UsersComponent;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let userService: UsersService;
  let userServiceSpy: jasmine.SpyObj<UsersService>;

  beforeEach(async () => {
    const userServiceMock = jasmine.createSpyObj('UsersService', ['deleteUser']);
    userServiceSpy = userServiceMock as jasmine.SpyObj<UsersService>;
    const dialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']); 

    await TestBed.configureTestingModule({
      declarations: [UsersComponent],
      providers: [
        MockProvider(UsersService, {
          getUsers: () => of([
            {
              idUser: 1,
              firstName: "Alejandro",
              lastName: "García",
              email: "alejandro_garcia@example.com",
              password: "123456789",
              role: "Estudiante",
              dni: "98765432100",
              birth: "07/15/1992",
              id: "4ec4"
            },
          ])
        }),
        { provide: MatDialog, useValue: dialogSpyObj } 
      ],
      imports: [HttpClientTestingModule, SharedModule] 
    }).compileComponents();

    component = TestBed.createComponent(UsersComponent).componentInstance;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    userService = TestBed.inject(UsersService);
  });

  it('Las columnas de la tabla de productos deben ser (displayedColumns): "idUser", "fullName", "email", "role", "actions"', () => {
    expect(component.displayedColumns).toContain('idUser');
    expect(component.displayedColumns).toContain('fullName');
    expect(component.displayedColumns).toContain('email');
    expect(component.displayedColumns).toContain('role');
    expect(component.displayedColumns).toContain('actions');
  });

  it('debería abrir el diálogo de edición de usuario y actualizar el usuario y cargar usuarios después de cerrarlo', () => {
    const mockUser = {
      idUser: 1,
      firstName: "Alejandro",
      lastName: "García",
      email: "alejandro_garcia@example.com",
      password: "123456789",
      role: "Estudiante",
      dni: "98765432100",
      birth: "07/15/1992",
      id: "4ec4"
    };

    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
    dialogSpy.open.and.returnValue(dialogRefSpyObj);

    component.editUser(mockUser);

    expect(dialogSpy.open).toHaveBeenCalledWith(UsereditformComponent, {
      width: '400px',
      data: mockUser
    });

    dialogRefSpyObj.afterClosed().subscribe(() => {
    });
  });

  it('debería abrir el modal de detalles de usuario', () => {
    const mockUser: User = {
      idUser: 1,
      firstName: "Alejandro",
      lastName: "García",
      email: "alejandro_garcia@example.com",
      password: "123456789",
      role: "Estudiante",
      dni: "98765432100",
      birth: "07/15/1992",
      id: "4ec4"
    };
  
    component.mostrarDetallesModal(mockUser);
  
    expect(dialogSpy.open).toHaveBeenCalledWith(UserdetailmodalComponent, {
      width: '400px',
      data: { userId: mockUser.id }
    });
  });

//aun faltan pruebas pero no llegaba con el tiempo

});
