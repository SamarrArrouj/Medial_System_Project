import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email: string = ''; 
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.email) {
      this.authService.forgotPassword(this.email).subscribe({
        next: (response) => {
          console.log('Réponse reçue :', response);  
          if (response && response.message) {
            this.successMessage = response.message;
          } else {
            this.successMessage = 'Un email de réinitialisation a été envoyé.';
          }
          
        },
        error: (error) => {
          console.error('Erreur API :', error); 
        
          if (error.status === 404) {
            this.errorMessage = 'L\'email n\'existe pas ou une erreur est survenue';
          } else {
            this.errorMessage = 'Une erreur inconnue est survenue, veuillez réessayer plus tard';
          }
          this.successMessage = '';
        }
      });
    } else {
      this.errorMessage = 'Veuillez entrer un email valide.';
    }
  }
  
}  