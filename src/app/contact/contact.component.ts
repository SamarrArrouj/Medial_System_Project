import { Component } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  responseMessage: string = '';
  isAuthenticated: boolean = false;
  constructor(private contactService: ContactService,
              private authService: AuthService,
              private router: Router) { 
   
  }
  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((auth) => {
      this.isAuthenticated = auth;
    });
  }

  onSubmit(): void {
    this.contactService.sendContactForm(this.contactForm).subscribe(
      response => {
        this.responseMessage = "Le message a été envoyé avec succès. On vous répondra dans les plus brefs délais.";
        // Reset form after successful submission
        this.contactForm = {
          name: '',
          email: '',
          subject: '',
          message: ''
        };
      },
      error => {
        this.responseMessage = "Erreur lors de l'envoi du message: " + error.message;
      }
    );
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
