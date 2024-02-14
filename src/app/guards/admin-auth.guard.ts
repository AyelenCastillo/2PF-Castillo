import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../layoults/auth/auth.service';

export const adminauthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  if (!authService.authUser) {
    return router.createUrlTree(['auth', 'login']);
  }

  if (authService.authUser.role !== 'ADMIN') {
    Swal.fire({
      icon: 'error',
      title: 'Acceso denegado',
      text: 'No tienes acceso a esta página'
    }).then(() => {
      router.navigate(['dashboard', 'home']);
    });
    return false; 
  }

  return true; 
};