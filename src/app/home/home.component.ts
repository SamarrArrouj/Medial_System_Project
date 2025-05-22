import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // ✅ Importer le module
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true, // ✅ Assure-toi qu’il est standalone
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule] // ✅ Ajoute CommonModule ici pour les directives comme *ngIf
})
export class HomeComponent implements OnInit {
  isAuthenticated: boolean = false;
  userFullName: string = '';
  profilePictureUrl: string = '';

  constructor(private authService: AuthService, private router: Router) {}

 
  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((status) => {
      this.isAuthenticated = status;

      if (status) {
        const user = this.authService.getDecodedToken();
        this.userFullName = user?.name || '';
        this.profilePictureUrl = user?.profilePictureUrl || 'profil.png';
      }
 
    }
  );
}

logout(): void {
  this.authService.logout();
  this.router.navigate(['/home']);
}
}

