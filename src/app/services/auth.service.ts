import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';  // Assurez-vous d'utiliser uniquement cette bibliothèque pour décoder le token

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7076/api/auth';  

  private authStatus = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.authStatus.asObservable();
  
  private jwtHelper: JwtHelperService;

  constructor(private http: HttpClient) {
    this.jwtHelper = new JwtHelperService();
  }

  // Méthode de connexion
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  // Sauvegarder le token dans localStorage
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.authStatus.next(true);
  
    // Nettoyer tous les anciens IDs
    localStorage.removeItem('patientId');
  
    const decodedToken = this.getDecodedToken();
    if (decodedToken) {
      const patientId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      console.log('Patient ID extrait du token:', patientId); // Déboguer l'ID ici
      
      // Sauvegarder uniquement l'ID correct
      localStorage.setItem('patientId', patientId);
    }
  }
  
  

  // Récupérer le token depuis localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Décoder le token pour obtenir ses données
  getDecodedToken(): any {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
  
    // Utiliser decodeToken de JwtHelperService
    return this.jwtHelper.decodeToken(token);
  }

  // Méthode de déconnexion
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.authStatus.next(false);
  }

  // Enregistrement d'un utilisateur
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  // Réinitialisation du mot de passe
  forgotPassword(email: string) {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, { email });
  }

  // Réinitialisation du mot de passe
  resetPassword(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, data);
  }

  // Récupérer l'utilisateur stocké dans localStorage
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Vérifier si un token existe dans localStorage
  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Obtenir l'ID utilisateur actuel à partir du token
  getCurrentUserId(): string {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || ''; 
    }
    return ''; // Retourner une chaîne vide si le token n'est pas disponible
  }

  // Sauvegarder l'ID utilisateur dans localStorage lors de l'authentification
  saveLogin(userId: string) {
    localStorage.setItem('userId', userId);
  }

  // Récupérer l'ID du patient depuis localStorage
  getPatientId(): string {
    const patientId = localStorage.getItem('patientId');
    
    // Vérifiez si le premier ID est valide (ajustez selon votre logique)
    if (patientId) {
      return patientId;
    }
  
    // Si le premier ID n'est pas valide, essayer d'utiliser un autre mécanisme ou retour à une valeur par défaut
    return ''; // Ou autre mécanisme selon votre besoin
  }
  
}
