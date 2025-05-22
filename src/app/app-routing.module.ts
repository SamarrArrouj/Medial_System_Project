import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HomeComponent } from './home/home.component';
import { SaisieSymptomesComponent } from './saisie-symptomes/saisie-symptomes.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactComponent } from './contact/contact.component';
import { AddDoctorComponent } from './components/add-doctor/add-doctor.component';
import { ListDoctorsComponent } from './list-doctors/list-doctors.component';
import { ListDoctorsAppointmentComponent } from './list-doctors-appointment/list-doctors-appointment.component';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DoctorDashboardComponent } from './doctor-dashboard/doctor-dashboard.component';
import { ResponsableDashboardComponent } from './responsable-dashboard/responsable-dashboard.component';
import { ListPatientsComponent } from './components/list-patients/list-patients.component';
import { ListDoctorsAdminComponent } from './components/list-doctors-admin/list-doctors-admin.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { ListAppointmentsComponent } from './components/list-appointments/list-appointments.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent }, 
  { path: 'register', component: RegisterComponent }, 
  { path: 'forgot-password', component: ForgotPasswordComponent }, 
  { path: 'reset-password', component: ResetPasswordComponent  }, 
  {path: 'home', component: HomeComponent},
  {path: 'saisie-symptomes', component: SaisieSymptomesComponent},
  {path: 'about-us', component: AboutUsComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'add-doctor', component: AddDoctorComponent},
  {path: 'list-doctors', component: ListDoctorsComponent},
  {path: 'list-doctors-appointment', component: ListDoctorsAppointmentComponent},
  {path: 'list-doctors-admin', component: ListDoctorsAdminComponent},
  {path: 'list-patients', component: ListPatientsComponent},
  {path: 'doctor-dashboard', component: DoctorDashboardComponent},
  {path: 'responsable-dashboard', component: ResponsableDashboardComponent},
  { path: 'book-appointment/:id', component: BookAppointmentComponent },
 
  {
    path: 'dashboard',
    component: AdminDashboardComponent,
    children: [
      { path: '', component: DashboardHomeComponent }, 
      { path: 'list-patients', component: ListPatientsComponent },
      { path: 'list-doctors-admin', component: ListDoctorsAdminComponent },
      {path: 'add-doctor', component: AddDoctorComponent},
      {path: 'list-appointments', component: ListAppointmentsComponent},
     
     
    ]
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
