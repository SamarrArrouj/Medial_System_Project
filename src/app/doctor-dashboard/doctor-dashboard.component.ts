import { Component } from '@angular/core';

import { AppointmentService } from '../services/appointment.service';
import { Router } from '@angular/router';

export interface Patient {
  username: string;
}

export interface Appointment {
  id: number;
  status: 'pending' | 'approved' | 'canceled';
  appointmentDate: string;
  patient?: Patient;
}

@Component({
  selector: 'app-doctor-dashboard',
  standalone: false,
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.css']
})
export class DoctorDashboardComponent {
  appointments: Appointment[] = [];
  totalAppointmentsCount = 0;
  approvedAppointmentsCount = 0;

  constructor(private appointmentService: AppointmentService, private router:Router) {}

  ngOnInit(): void {
    this.appointmentService.getMyApprovedAppointments().subscribe({
      next: (response) => {
        this.appointments = response.appointments;

        // Total de rendez-vous (tous statuts)
        this.totalAppointmentsCount = this.appointments.length;

        // Nombre de rendez-vous approuvés
        this.approvedAppointmentsCount = this.appointments.filter(
          a => a.status === 'approved'
        ).length;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des rendez-vous :', err);
      }
    });
  }

  logout() {
 
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
