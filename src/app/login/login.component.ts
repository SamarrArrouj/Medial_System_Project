import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isAuthenticated: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        const token = response.accessToken;
        this.authService.saveToken(token);

        const decoded = this.authService.getDecodedToken();
        if (!decoded) {
          this.errorMessage = 'Échec du décodage du token';
          return;
        }

        localStorage.setItem('user', JSON.stringify(decoded));

        // Vérification et gestion du rôle
        const role = this.getRoleFromToken(decoded);

        // Redirection en fonction du rôle
        this.redirectBasedOnRole(role);
      },
      error: () => {
        this.errorMessage = 'Email ou mot de passe incorrect';
      }
    });
  }

  // Méthode pour extraire et normaliser le rôle à partir du token
  private getRoleFromToken(decodedToken: any): string {
    let role = 'patient'; // Valeur par défaut
  
    console.log('Decoded Token:', decodedToken); // Affichez le contenu complet du token pour déboguer
  
    // Chercher le rôle sous "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    if (decodedToken?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) {
      console.log('Role trouvé dans "role":', decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
      role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'].toLowerCase();
    } else if (decodedToken?.role) {
      // Cas où le rôle est sous "role"
      console.log('Role trouvé dans "role":', decodedToken.role);
      role = decodedToken.role.toLowerCase();
    } else if (decodedToken?.roles && Array.isArray(decodedToken.roles)) {
      // Cas où le rôle est dans un tableau sous "roles"
      console.log('Role trouvé dans "roles":', decodedToken.roles);
      role = decodedToken.roles[0]?.toLowerCase() || role;
    }
  
    console.log('Role final:', role); // Affichez le rôle final avant de le renvoyer
    return role;
  }
  
  
  // Méthode de redirection en fonction du rôle
  private redirectBasedOnRole(role: string): void {
    switch (role) {
      case 'admin':
        this.router.navigate(['dashboard']);
        break;
      case 'medecin':
        this.router.navigate(['/doctor-dashboard']);
        break;
      case 'responsablesante':
        this.router.navigate(['/responsable-dashboard']);
        break;
      case 'patient':
      default:
        this.router.navigate(['/home']);
        break;
    }
  }
}
