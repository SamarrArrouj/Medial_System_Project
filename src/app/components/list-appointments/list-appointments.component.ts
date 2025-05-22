import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Appointment } from '../../responsable-dashboard/responsable-dashboard.component';

@Component({
  selector: 'app-list-appointments',
  standalone: false,
  templateUrl: './list-appointments.component.html',
  styleUrl: './list-appointments.component.css'
})
export class ListAppointmentsComponent {
  constructor(private http: HttpClient, private dashboardService: DashboardService) { }
  nbAppointments: number = 0;
  approvedAppointments: number =0;
  canceledAppointments: number =0;
  appointments: any[] = [];
  statusMap: { [id: string]: 'approved' | 'canceled' | null } = {};

  ngOnInit(): void {
    this.dashboardService.getStatistiquesAppointments().subscribe((data) => {
      this.nbAppointments = data.totalAppointments;
    });
    this.dashboardService.getApprovedAppointments().subscribe((data) => {
      this.approvedAppointments = data.totalApproved;
    });
    this.dashboardService.getCanceledAppointments().subscribe((data) => {
      this.canceledAppointments = data.totalCanceled;
    });
    this.dashboardService.getAllAppointments().subscribe(response => {
      if (response.success) {
        this.appointments = response.appointments;
      }
    });
    this.http.get<Appointment[]>('https://localhost:7076/api/Appointment/pending').subscribe(data => {
      this.appointments = data;
    });
    

  }

  approveAppointment(id: string) {
    this.http.put(`https://localhost:7076/api/Appointment/approve/${id}`, {}).subscribe(() => {
      const appointment = this.appointments.find(a => a.id === id);
      if (appointment) appointment.status = 'approved';
    });
  }
  
  cancelAppointment(id: string) {
    this.http.put(`https://localhost:7076/api/Appointment/cancel/${id}`, {}).subscribe(() => {
      const appointment = this.appointments.find(a => a.id === id);
      if (appointment) appointment.status = 'canceled';
    });
  }
  
  
  
  
  refreshAppointments(): void {
    this.dashboardService.getAllAppointments().subscribe(response => {
      if (response.success) {
        this.appointments = response.appointments.filter(app => app.status === "En attente");
      }
    });
  }
  
  
  
}

