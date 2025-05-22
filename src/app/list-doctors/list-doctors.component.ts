import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';

@Component({
  selector: 'app-list-doctors',
  standalone: false,
  templateUrl: './list-doctors.component.html',
  styleUrl: './list-doctors.component.css'
})
export class ListDoctorsComponent implements OnInit {
  doctors: any[] = []; 

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors() {
    this.doctorService.getDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des médecins :', err);
      }
    });
  }
}
