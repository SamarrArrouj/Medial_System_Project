import { Component } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.css'],
})
export class AddDoctorComponent {
  isModalOpen = false;

  doctor = {
    username: '',
    Sexe: '',
    email: '',
    password: '',
    specialty: '',
    photo: null as File | null
  };

  confirmationMessage = '';
  errorMessage = '';

  constructor(private doctorService: DoctorService, private router: Router) {}

  ngOnInit() {
 
    this.openModal();
  }

  openModal() {
    this.isModalOpen = true;
    document.body.classList.add('blurred');
  }

  closeModal() {
    this.isModalOpen = false;
    document.body.classList.remove('blurred');
    this.router.navigate(['/dashboard/list-doctors-admin']);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.doctor.photo = file;
    }
  }

  saveDoctor() {
    this.confirmationMessage = '';
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('username', this.doctor.username);
    formData.append('email', this.doctor.email);
    formData.append('password', this.doctor.password);
    formData.append('sexe', this.doctor.Sexe);
    formData.append('specialty', this.doctor.specialty);

    if (this.doctor.photo) {
      formData.append('photo', this.doctor.photo, this.doctor.photo.name);
    }

    this.doctorService.addDoctor(formData).subscribe({
      next: (response) => {
        this.confirmationMessage = response.message;
        setTimeout(() => {
          this.closeModal();
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = 'Erreur : ' + err.error.error;
      }
    });
  }
}
