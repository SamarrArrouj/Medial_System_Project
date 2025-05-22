import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface DashboardData {
  doctors: number;
  patients: number;
  appointments: number;
  newPatients: number;
  opdPatients: number;
  labTests: number;
  earnings: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl =  'https://localhost:7076/api/Statistics';

  constructor(private http: HttpClient) { }

  getStatistiques() {
    return this.http.get<{ patients: number, medecins: number }>(this.apiUrl);
  }

  
  getStatistiquesAppointments() {
    return this.http.get<{ totalAppointments: number}>(`${this.apiUrl}/appointments-total`);
  }
  getApprovedAppointments() {
    return this.http.get<{ success: boolean; totalApproved: number }>(`${this.apiUrl}/appointments-approved`);
  }
  getCanceledAppointments() {
    return this.http.get<{ success: boolean; totalCanceled: number }>(`${this.apiUrl}/appointments-canceled`);
  }
  
  getAllAppointments() {
    return this.http.get<{ success: boolean, appointments: any[] }>('https://localhost:7076/api/Appointment/all');
  }
  
  getVisitorStats() {
    return this.http.get<{ date: string; views: number }[]>('https://localhost:7076/api/Statistics/visitors');
  }

  approveAppointment(id: string) {
    return this.http.put(`https://localhost:7076/api/Appointment/approve/${id}`, {});
  }
  
  
 cancelAppointment(id: string) {
  return this.http.put(`https://localhost:7076/api/Appointment/cancel/${id}`, {});
}

  
  
}
