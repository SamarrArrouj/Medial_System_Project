import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

declare const google: any;
@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user = {
    username: '',
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.authService.register(this.user).subscribe({
      next: (response) => {
        console.log('Inscription réussie', response);
        alert('Inscription réussie !');
        this.router.navigate(['/login']); // Rediriger vers la page de connexion
      },
      error: (error) => {
        console.error('Erreur d\'inscription', error);
        alert('Erreur lors de l\'inscription');
      }
    });
  }

 
}