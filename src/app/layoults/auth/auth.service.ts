import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { delay, map } from "rxjs/operators";
import { User } from "../dashboard/pages/users/models";
import { UsersService } from "../dashboard/pages/users/users.service";
import { of } from "rxjs";

export interface LoginData {
    email: string;
    password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

    authUser: User | null = null;
    token: string = '';

    constructor(private router: Router, private usersService: UsersService) { 
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
            this.authUser = JSON.parse(storedUser);
        }
    }

    login(data: LoginData): void {
        if (data.email && data.password) {
            this.usersService.getUsers().subscribe(users => {
                const authenticatedUser = users.find(user =>
                    user.email === data.email &&
                    user.password === data.password 
                );
                if (authenticatedUser) {
                    this.authUser = {
                        email: authenticatedUser.email,
                        password: '', 
                        role: authenticatedUser.role 
                    };
                    this.token = this.generarToken();
                    localStorage.setItem('authUser', JSON.stringify(this.authUser));
                    localStorage.setItem('token', this.token);
                    this.router.navigate(['dashboard', 'home']);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de autenticación',
                        text: 'Usuario y/o contraseña inválidos',
                    });
                }
            });
        } else {
            console.error('Faltan datos de autenticación');
        }
    }
    
    logout(): void {
        this.authUser = null;
        localStorage.removeItem('authUser');
        localStorage.removeItem('token');
        this.router.navigate(['auth','login']);
    }

    generarToken(): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let token = "";
        for (let i = 0; i < 10; i++) {
            token += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return token;
    }

    verifyToken() {
        return of(localStorage.getItem('token')).pipe(delay(1000),map((res) => !!res));
    }
}
