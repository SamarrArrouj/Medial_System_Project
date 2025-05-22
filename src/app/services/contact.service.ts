import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private apiUrl = 'https://localhost:7076/api/Contact'; 

  constructor(private http: HttpClient) { }

  sendContactForm(contactForm: any): Observable<any> {
    return this.http.post(this.apiUrl, contactForm);
  }
}
