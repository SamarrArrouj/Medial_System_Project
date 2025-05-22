import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Symptom {
  age: number;
  gender: string;
  dateOfAppearance: string;
  occupation: string;
  growing_Stress: boolean;
  changes_Habits: number;
  weight_change: boolean;
  mood_change: number;
  mental_Health_History: boolean;
  work_Interest: number;
  social_Weakness: number;
}


@Injectable({
  providedIn: 'root'
})
export class SymptomService {
  private apiUrl = 'https://localhost:7076/api/symptoms'; 

  constructor(private http: HttpClient) {}

  // Récupérer tous les symptômes
  getSymptoms(): Observable<Symptom[]> {
    return this.http.get<Symptom[]>(this.apiUrl);
  }

  // Ajouter un symptôme
  addSymptom(payload: Symptom): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddSymptom`, payload);
  }
  
  


}
