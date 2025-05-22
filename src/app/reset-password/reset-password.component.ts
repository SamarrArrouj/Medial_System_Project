import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  email: string = '';
  token: string = '';
  newPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer les paramètres de l'URL
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.token = params['token'];
    });

    // Initialiser le formulaire
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  onSubmit() {
    console.log('Données envoyées :', {
      email: this.email,
      token: this.token,
      newPassword: this.newPassword
    });
  
    const resetPasswordData = {
      email: this.email,
      token: this.token,
      newPassword: this.newPassword
    };
  
    this.authService.resetPassword(resetPasswordData).subscribe({
      next: (response) => {
        console.log('Réponse du serveur : ', response);
        if (response.message) {
          alert(response.message);
          localStorage.setItem('token', response.token);
        }
      },
      error: (error) => {
        console.log('Erreur : ', error);
        alert('Une erreur est survenue lors de la réinitialisation du mot de passe.');
      }
    });
  }
  
  
  
}  