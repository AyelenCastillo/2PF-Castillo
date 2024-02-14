import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent {
  showFiller = false;
  showFiller1 = false;
  showFiller2 = false;

  constructor(private authService: AuthService,private router: Router) { }

  logout(): void {
    this.authService.logout(); 
  }

}
