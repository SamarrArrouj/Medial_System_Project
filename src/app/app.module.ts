import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { HomeComponent } from './home/home.component';
import { SaisieSymptomesComponent } from './saisie-symptomes/saisie-symptomes.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactComponent } from './contact/contact.component';
import { AddDoctorComponent } from './components/add-doctor/add-doctor.component';
import { ListDoctorsComponent } from './list-doctors/list-doctors.component';
import { ListDoctorsAppointmentComponent } from './list-doctors-appointment/list-doctors-appointment.component';
import { CommonModule, DatePipe } from '@angular/common';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ResponsableDashboardComponent } from './responsable-dashboard/responsable-dashboard.component';
import { MatDialogModule } from '@angular/material/dialog';


import { DoctorDashboardComponent } from './doctor-dashboard/doctor-dashboard.component';
import { AuthInterceptor } from './book-appointment/auth.interceptor';
import { ListDoctorsAdminComponent } from './components/list-doctors-admin/list-doctors-admin.component';
import { ListPatientsComponent } from './components/list-patients/list-patients.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { ListAppointmentsComponent } from './components/list-appointments/list-appointments.component';




@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  
    AboutUsComponent,
    ContactComponent,

    ListDoctorsComponent,
    ListDoctorsAppointmentComponent,
    BookAppointmentComponent,
    AdminDashboardComponent,
    ResponsableDashboardComponent,
    ListDoctorsAdminComponent,
    DoctorDashboardComponent,
    DashboardHomeComponent,
    ListAppointmentsComponent
   
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule,
    CommonModule,
    HomeComponent,
    MatDialogModule,
    
    
  ],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
