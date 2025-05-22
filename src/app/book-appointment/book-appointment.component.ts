import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../services/doctor.service';
import { AppointmentService } from '../services/appointment.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

export interface Doctor {
  id: string;
  username: string;
}

@Component({
  selector: 'app-book-appointment',
  standalone: false,
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.css']
})
export class BookAppointmentComponent implements OnInit {
  availableTimes: string[] = []; // Tableau pour les heures disponibles
  doctors: Doctor[] = [];
  appointmentDate: string = '';
  doctorId: string = '';
  selectedDoctor: any = null;
  showConfirmation = false;
  errorMessage: string | null = null;
  isAuthenticated: boolean = false;

  form = {
    appointmentDate: '',
    appointmentTime: '',  // Heure sélectionnée
    patientId: '',
    doctorId: ''
  };

  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private http: HttpClient,
    private doctorService: DoctorService,
    private authService: AuthService,
    private router: Router
  ) {
    // Générer les heures de travail entre 9:00 et 16:00
    this.availableTimes = this.generateAvailableTimes(9, 16);
  }
  selectTime(time: string) {
    this.form.appointmentTime = time;
  }
  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((auth) => {
      this.isAuthenticated = auth;
    });

    this.form.patientId = this.authService.getCurrentUserId();
    console.log("Patient ID récupéré:", this.form.patientId);

    this.route.params.subscribe(params => {
      const doctorIdFromUrl = this.route.snapshot.paramMap.get('id');
      if (doctorIdFromUrl) {
        this.form['doctorId'] = doctorIdFromUrl;
        console.log("Docteur ID récupéré depuis l'URL:", doctorIdFromUrl);
      } else {
        console.error("Docteur ID manquant dans l'URL");
      }
    });

    this.loadDoctors();
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors;
        console.log("Médecins récupérés:", this.doctors);

        // Chercher le médecin sélectionné par ID
        const selected = this.doctors.find(doc => doc.id === this.form.doctorId);
        if (selected) {
          this.selectedDoctor = selected;
          console.log("Médecin sélectionné :", this.selectedDoctor);
        } else {
          console.warn("Aucun médecin correspondant trouvé pour l'ID :", this.form.doctorId);
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des médecins:', error);
      }
    });
  }

  onSubmit(): void {
    if (!this.form.appointmentDate || !this.form.appointmentTime || !this.form.patientId || !this.form.doctorId) {
      return;
    }

    this.errorMessage = null; // Réinitialiser le message d'erreur

    // Combine the date and time into a single ISO string for the appointment
    const dateTime = `${this.form.appointmentDate}T${this.form.appointmentTime}:00`; 

    this.appointmentService.createAppointment({
      ...this.form,
      appointmentDate: dateTime // Pass the combined date and time
    }).subscribe(
      (response) => {
        console.log('Appointment created:', response);
        this.showConfirmation = true;

        // Optionnel : cacher le message après 4 secondes
        setTimeout(() => {
          this.showConfirmation = false;
        }, 4000);
      },
      (error) => {
        console.error('Error creating appointment:', error);

        if (error.status === 409) {
          // Créneau déjà réservé
          this.errorMessage = "❌ Ce créneau est déjà réservé. Veuillez choisir une autre heure ou date.";
        } else {
          this.errorMessage = "❌ Une erreur s'est produite lors de la prise de rendez-vous.";
        }
      }
    );
  }

  goBack() {
    this.router.navigate(['/list-doctors-appointment']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  // Fonction pour générer les heures disponibles entre deux heures
  generateAvailableTimes(startHour: number, endHour: number): string[] {
    let times: string[] = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${this.formatNumber(hour)}:${this.formatNumber(minute)}`;
        times.push(time);
      }
    }
    return times;
  }

  // Fonction pour formater les heures et minutes (ex: 09:00)
  formatNumber(number: number): string {
    return number < 10 ? `0${number}` : `${number}`;
  }
}
