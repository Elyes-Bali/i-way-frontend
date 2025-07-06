import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
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
import { AllDoctorsComponent } from './admin/doctorsComponent/allDoctors/all-doctors/all-doctors.component';
import { AllAppointmentsComponent } from './admin/doctorsComponent/allAppointments/all-appointments/all-appointments.component';
import { PatientAppointmentsComponent } from './patient/myAppointments/patient-appointments/patient-appointments.component';
import { AboutComponent } from './about/about/about.component';
import { AllPatientsComponent } from './admin/patientComponents/all-patients/all-patients.component';
import { PostListComponent } from './comunity/post-list/post-list.component';
import { SavedPostsComponent } from './comunity/saved-posts/saved-posts.component';
import { MyPostsComponent } from './comunity/my-posts/my-posts.component';
import { AddNewsComponent } from './admin/news/add-news/add-news.component';
import { MedicalFileComponent } from './medical-file/medical-file.component';
import { MyPatientsComponent } from './my-patients/my-patients.component';
import { PrescriptionsComponent } from './patient/prescriptions/prescriptions.component';
import { RealTimeChatComponent } from './real-time-chat/real-time-chat.component';
import { ChartsComponent } from './admin/charts/charts.component';
import { PharmacySignupComponent } from './pharmacy-signup/pharmacy-signup.component';
import { AllPharmaciesComponent } from './admin/all-pharmacies/all-pharmacies.component';
import { SearchPrescriptionsComponent } from './pharmacy/search-prescriptions/search-prescriptions.component';
import { AddPrescriptionComponent } from './add-prescription/add-prescription.component';
import { DoctorPrescriptionsComponent } from './doctor-prescriptions/doctor-prescriptions.component';
import { EditPrescriptionComponent } from './edit-prescription/edit-prescription.component';
import { MyPrescriptionsComponent } from './patient/my-prescriptions/my-prescriptions.component';
import { LabInterpreterComponent } from './patient/lab-interpreter/lab-interpreter.component';
import { TestCodesComponent } from './test-codes/test-codes.component';




const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'reclamations', component: AllReclamationsComponent },
  { path: 'editereclamation/:id', component: EditReclamationsComponent },
  { path: 'profile/reclamations', component: ProfileComponent },
  { path: 'doctor-signup', component: DoctorSignupComponent },
  { path: 'pharmacy-signup', component: PharmacySignupComponent },
  { path: 'doctor', component: DoctorComponent },
  { path: 'all-Doctors', component: AppointmentComponent },
  { path: 'docprofile/:id', component: DoctorProfileComponent },
  { path: 'update-user/:id', component: UpdateUserComponent },
  { path: 'admin/docs', component: AllDoctorsComponent },
  { path: 'admin/patients', component: AllPatientsComponent },
  { path: 'admin/pharmacies', component: AllPharmaciesComponent },
  { path: 'docs/allapointments/:id', component: AllAppointmentsComponent },
  { path: 'community', component: PostListComponent },
  { path: 'saved-posts', component: SavedPostsComponent },
  { path: 'my-posts', component: MyPostsComponent },
  { path: 'add-news', component: AddNewsComponent },
  { path: 'medical-file/:patientId/:doctorId', component: MedicalFileComponent },
  { path: 'mypatients', component: MyPatientsComponent },
  { path: 'myprescription', component: PrescriptionsComponent },
  { path: 'chatting', component: RealTimeChatComponent },
  { path: 'charts', component: ChartsComponent },
  { path: 'pharmacy/prescription', component: SearchPrescriptionsComponent },
  { path: 'add-prescription/:patientId/:doctorId', component: AddPrescriptionComponent },
  { path: 'my-prescriptions/:patientId', component: DoctorPrescriptionsComponent },
  { path: 'edit-prescription/:id', component: EditPrescriptionComponent },
  { path: 'Patient-prescriptions', component: MyPrescriptionsComponent },
  { path: 'HealLink-Ai-lab-interpreter', component: LabInterpreterComponent },


  {
    path: 'patient/allapointments/:id',
    component: PatientAppointmentsComponent,
  },
  { path: 'aboutus', component: AboutComponent },
  // { path: 'test', component: TestCodesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
