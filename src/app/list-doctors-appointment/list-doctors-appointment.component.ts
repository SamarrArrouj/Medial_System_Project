import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService } from '../services/appointment.service';
import { AuthService } from '../services/auth.service';

export interface Doctor {
  id: string;
  username: string;
  sexe: string;
  email: string;
  specialty: string;
  photoUrl: string;
}

@Component({
  selector: 'app-list-doctors-appointment',
  standalone: false,
  templateUrl: './list-doctors-appointment.component.html',
  styleUrl: './list-doctors-appointment.component.css'
})
export class ListDoctorsAppointmentComponent implements OnInit {
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];

  searchTerm: string = '';
  selectedSpecialty: string = '';
  specialties: string[] = [];

  selectedDate: string = '';
  selectedTime: string = '';
  patientId: string = '';
  isAuthenticated: boolean = false;

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(auth => {
      this.isAuthenticated = auth;
    });

    this.patientId = this.authService.getCurrentUserId();
    console.log("Patient ID récupéré:", this.patientId);

    this.loadDoctors();
  }

  loadDoctors() {
    this.appointmentService.getDoctors().subscribe(doctors => {
      this.doctors = doctors;

      // Extraire les spécialités uniques
      this.specialties = Array.from(new Set(this.doctors.map(d => d.specialty))).sort();

      this.applyFilters();  // Appliquer les filtres dès le chargement
    });
  }

  applyFilters() {
    this.filteredDoctors = this.doctors.filter(doc => {
      const matchesName = doc.username.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesSpecialty = this.selectedSpecialty ? doc.specialty === this.selectedSpecialty : true;
      return matchesName && matchesSpecialty;
    });
  }

  bookAppointment(doctorId: string) {
    if (!this.selectedDate || !this.selectedTime) {
      alert("Veuillez choisir une date et une heure.");
      return;
    }

    const appointmentDate = `${this.selectedDate}T${this.selectedTime}:00`; // format ISO

    this.appointmentService.createAppointment({
      doctorId,
      patientId: this.patientId,
      appointmentDate
    }).subscribe({
      next: (res) => alert("Rendez-vous pris avec succès !"),
      error: (err) => alert("Erreur : " + (err.error?.error || 'Impossible de prendre rendez-vous'))
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
