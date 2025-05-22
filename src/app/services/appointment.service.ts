import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AppointmentRequest {
  doctorId: string;
  patientId: string;
  appointmentDate: string; 
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'https://localhost:7076/api/Appointment';

  constructor(private http: HttpClient) {}

  getDoctors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/doctors`);
  }

  createAppointment(appointmentRequest: AppointmentRequest) {
    const token = localStorage.getItem('token'); // Récupérer le token
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    // Envoyer l'objet avec doctorId, patientId et appointmentDate
    return this.http.post(`${this.apiUrl}/create`, appointmentRequest, { headers });
  }

  getMyApprovedAppointments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/approved-by-doctor`);
  }
  
}
