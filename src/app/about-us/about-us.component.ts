import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-us',
  standalone: false,
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {
  isAuthenticated: boolean = false;
  constructor(
   
    private authService: AuthService,
    private router: Router

  ) {
 
  }
  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((auth) => {
      this.isAuthenticated = auth;
    });
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
