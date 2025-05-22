import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'https://localhost:7076/api/Admin';

  constructor(private http: HttpClient) {}

  addDoctor(doctorData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-doctor`, doctorData);
  }

  getDoctors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all-doctors`);
  }
  getDoctorById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/doctor/${id}`);
  }
  deleteDoctor(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  

  
}