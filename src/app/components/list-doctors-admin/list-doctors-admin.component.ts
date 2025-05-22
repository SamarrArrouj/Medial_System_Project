import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';


@Component({
  selector: 'app-list-doctors-admin',
  standalone: false,
  templateUrl: './list-doctors-admin.component.html',
  styleUrl: './list-doctors-admin.component.css'
})
export class ListDoctorsAdminComponent implements OnInit {
  doctors: any[] = [];

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des médecins', err);
      }
    });
  }
}

