import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl = 'https://localhost:7076/api/Admin';

  constructor(private http: HttpClient) {}
   getPatients(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/all-patients`);
    }
}
