import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoAngularMaterialModule } from './DemoAngularMaterialModule';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { AllReclamationsComponent } from './reclamations/allRecs/all-reclamations/all-reclamations.component';
import { EditReclamationsComponent } from './reclamations/editRecs/edit-reclamations/edit-reclamations.component';
import { ProfileComponent } from './patient/profile/profile.component';
import { HomeComponent } from './home/home.component';
import { DoctorSignupComponent } from './doctor-signup/doctor-signup.component';
import { DoctorComponent } from './doctor/doctor.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { DoctorProfileComponent } from './doctor-profile/doctor-profile.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AllDoctorsComponent } from './admin/doctorsComponent/allDoctors/all-doctors/all-doctors.component';
import { AllAppointmentsComponent } from './admin/doctorsComponent/allAppointments/all-appointments/all-appointments.component';
import { PatientAppointmentsComponent } from './patient/myAppointments/patient-appointments/patient-appointments.component';
import { DocSidebarComponent } from './docSide/doc-sidebar/doc-sidebar.component';
import { AboutComponent } from './about/about/about.component';
import { PatientSidebarComponent } from './patSide/patient-sidebar/patient-sidebar.component';
import { AllPatientsComponent } from './admin/patientComponents/all-patients/all-patients.component';
import { PostListComponent } from './comunity/post-list/post-list.component';
import { SavedPostsComponent } from './comunity/saved-posts/saved-posts.component';
import { MyPostsComponent } from './comunity/my-posts/my-posts.component';
import { AddNewsComponent } from './admin/news/add-news/add-news.component';
import { AllNewsComponent } from './all-news/all-news.component';
import { MedicalFileComponent } from './medical-file/medical-file.component';
import { MyPatientsComponent } from './my-patients/my-patients.component';
import { PrescriptionsComponent } from './patient/prescriptions/prescriptions.component';
import { RealTimeChatComponent } from './real-time-chat/real-time-chat.component';
import { ChartsComponent } from './admin/charts/charts.component';
import { NgChartsModule } from 'ng2-charts';
import { FullCalendarModule } from '@fullcalendar/angular';
import { PharmacySignupComponent } from './pharmacy-signup/pharmacy-signup.component';
import { AllPharmaciesComponent } from './admin/all-pharmacies/all-pharmacies.component';
import { SearchPrescriptionsComponent } from './pharmacy/search-prescriptions/search-prescriptions.component';






@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ChatComponent,
    AllReclamationsComponent,
    EditReclamationsComponent,
    ProfileComponent,
    HomeComponent,
    DoctorSignupComponent,
    DoctorComponent,
    AppointmentComponent,
    DoctorProfileComponent,
    UpdateUserComponent,
    SidebarComponent,
    AllDoctorsComponent,
    AllAppointmentsComponent,
    PatientAppointmentsComponent,
    DocSidebarComponent,
    AboutComponent,
    PatientSidebarComponent,
    AllPatientsComponent,
    PostListComponent,
    SavedPostsComponent,
    MyPostsComponent,
    AddNewsComponent,
    AllNewsComponent,
    MedicalFileComponent,
    MyPatientsComponent,
    PrescriptionsComponent,
    RealTimeChatComponent,
    ChartsComponent,
    PharmacySignupComponent,
    AllPharmaciesComponent,
    SearchPrescriptionsComponent,



  
 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DemoAngularMaterialModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    NgChartsModule,
    FullCalendarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
