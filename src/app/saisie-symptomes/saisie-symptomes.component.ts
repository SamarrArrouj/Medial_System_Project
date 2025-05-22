import { Component, OnInit } from '@angular/core';
import { Symptom, SymptomService } from '../services/symptom.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';  // à adapter selon ta structure
import { Router } from '@angular/router';

@Component({
  selector: 'app-saisie-symptomes',
  templateUrl: './saisie-symptomes.component.html',
  styleUrls: ['./saisie-symptomes.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class SaisieSymptomesComponent implements OnInit {

  symptoms: Symptom[] = [];
  newSymptom: Symptom = {
    age: 0,
    gender: '',
    dateOfAppearance: '',
    occupation: '',
    growing_Stress: false,
    changes_Habits: 0,
    weight_change: false,
    mood_change: 0,
    mental_Health_History: false,
    work_Interest: 0,
    social_Weakness: 0
  };

  ageRange: string = '';

  isAuthenticated: boolean = false;
  userFullName: string = '';
  profilePictureUrl: string = '';

  constructor(
    private symptomService: SymptomService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSymptoms();

    this.authService.isAuthenticated$.subscribe((status) => {
      this.isAuthenticated = status;

      if (status) {
        const user = this.authService.getDecodedToken();
        this.userFullName = user?.name || '';
        this.profilePictureUrl = user?.profilePictureUrl || 'profil.png';
      } else {
        this.userFullName = '';
        this.profilePictureUrl = '';
      }
    });
  }

  loadSymptoms(): void {
    this.symptomService.getSymptoms().subscribe({
      next: (data) => {
        this.symptoms = data;
      },
      error: (err) => {
        console.error('Erreur de chargement des symptômes:', err);
      }
    });
  }

  public formatDate(): void {
    if (this.newSymptom.dateOfAppearance) {
      const dateObj = new Date(this.newSymptom.dateOfAppearance);
      this.newSymptom.dateOfAppearance = dateObj.toISOString().split('T')[0];
    }
  }

  private convertAgeRangeToNumber(range: string): number {
    switch (range) {
      case '16-20': return 18;
      case '20-25': return 22;
      case '25-30': return 27;
      case '30-Above': return 31;
      default: return 0; // Valeur par défaut ou invalide
    }
  }

  submitSymptom(): void {
    if (!this.isAuthenticated) {
      alert('Vous devez être connecté en tant que patient pour ajouter un symptôme.');
      this.router.navigate(['/login']);  // ou autre page de connexion
      return;
    }

    this.formatDate();

    if (this.ageRange) {
      this.newSymptom.age = this.convertAgeRangeToNumber(this.ageRange);
    }

    this.symptomService.addSymptom(this.newSymptom).subscribe({
      next: () => {
        alert('Symptôme ajouté avec succès !');
        this.resetForm();
        this.loadSymptoms();
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout du symptôme:", err);

        if (err.error && err.error.errors) {
          const validationErrors = err.error.errors;
          let message = 'Erreurs de validation :\n';
          for (const field in validationErrors) {
            if (validationErrors.hasOwnProperty(field)) {
              message += `- ${field}: ${validationErrors[field].join(', ')}\n`;
            }
          }
          alert(message);
        } else {
          alert("Erreur lors de l'ajout. Veuillez réessayer.");
        }
      }
    });
  }

  resetForm(): void {
    this.newSymptom = {
      age: 0,
      gender: '',
      dateOfAppearance: '',
      occupation: '',
      growing_Stress: false,
      changes_Habits: 0,
      weight_change: false,
      mood_change: 0,
      mental_Health_History: false,
      work_Interest: 0,
      social_Weakness: 0
    };
    this.ageRange = '';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
