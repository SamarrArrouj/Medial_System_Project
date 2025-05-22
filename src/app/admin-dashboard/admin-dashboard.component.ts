import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DashboardService } from '../services/dashboard.service';
import { HttpClient } from '@angular/common/http';




// admin-dashboard.component.ts
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement ,
} from 'chart.js';
import { AddDoctorComponent } from '../components/add-doctor/add-doctor.component';
import { Router } from '@angular/router';

Chart.register(
  LineController, 
  LineElement, 
  PointElement, 
  LinearScale, 
  Title, 
  CategoryScale, 
  Tooltip, 
  Legend,
  DoughnutController,
  ArcElement          
);
@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent {
  nbPatients = 0;
  nbMedecins = 0;

  constructor(private dashboardService: DashboardService, private http: HttpClient, private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.dashboardService.getStatistiques().subscribe((data) => {
      this.nbPatients = data.patients;
      this.nbMedecins = data.medecins;
    });
    this.loadChart();
    this.loadDoctorGenderChart();
    this.loadPatientGenderChart();
    this.loadVisitorChart();
  }

  loadChart(): void {
    this.http.get<any>('https://localhost:7076/api/Statistics/journaliere').subscribe((data) => {
      const ctx = document.getElementById('doctorPatientChart') as HTMLCanvasElement;

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.labels,
          datasets: [
            {
              label: 'Patients',
              data: data.patients,
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: 'rgba(75,192,192,0.2)',
              tension: 0.3,
            },
            {
              label: 'Médecins',
              data: data.medecins,
              borderColor: 'rgba(255,99,132,1)',
              backgroundColor: 'rgba(255,99,132,0.2)',
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    });
  }
  loadDoctorGenderChart(): void {
    this.http.get<any>('https://localhost:7076/api/Statistics/medecins-par-sexe').subscribe((data) => {
      const ctx = document.getElementById('doctorGenderChart') as HTMLCanvasElement;
  
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Hommes', 'Femmes'],
          datasets: [
            {
              label: 'Répartition des médecins',
              data: [data.hommes, data.femmes],
              backgroundColor: ['#36A2EB', '#FF6384'],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
            tooltip: {
              enabled: true,
            },
          },
        },
      });
    });
  }
  
  

  loadPatientGenderChart(): void {
    this.http.get<any>('https://localhost:7076/api/Statistics/patients-par-sexe').subscribe((data) => {
      const ctx = document.getElementById('PatientGenderChart') as HTMLCanvasElement;

      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Hommes', 'Femmes'],
          datasets: [
            {
              label: 'Répartition des patients',
              data: [data.hommes, data.femmes],
              backgroundColor: ['#36A2EB', '#FF6384'],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
            tooltip: {
              enabled: true,
            },
          },
        },
      });
    });
  }

 loadVisitorChart(): void {
  this.dashboardService.getVisitorStats().subscribe(data => {
    const labels = data.map(d => new Date(d.date).toLocaleDateString());
    const values = data.map(d => d.views);

    const ctx = document.getElementById('visitorChart') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Nombre de Visiteurs',
          data: values,
          borderColor: 'blue',
          backgroundColor: 'rgba(0, 123, 255, 0.2)',
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  });
  }

  openAddDoctorDialog(): void {
    const dialogRef = this.dialog.open(AddDoctorComponent, {
      width: '400px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  
  logout(): void {
    // Supprimer les données du localStorage ou cookies si besoin
    localStorage.removeItem('authToken'); // ou tout autre clé que tu utilises

    // Rediriger vers la page de login
    this.router.navigate(['/login']);
  }
  

}
