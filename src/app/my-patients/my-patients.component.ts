import { Component, OnInit } from '@angular/core';
import { UserDetails } from '../models/user.model';
import { AppointmentsService } from '../services/appointments/appointments.service';
import { Router } from '@angular/router';
import { Appointment } from '../models/appointment.model';
import { UserStorageService } from '../services/storage/user-storage.service';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-my-patients',
  templateUrl: './my-patients.component.html',
  styleUrls: ['./my-patients.component.css'],
})
export class MyPatientsComponent implements OnInit {
  doctorId: number;
  patients: UserDetails[] = [];
  appointments: Appointment[] = [];

  patientsWithAcceptedAppointments: UserDetails[] = [];
  constructor(
    private appointmentService: AppointmentsService,
    private router: Router,
    private userStorageService: UserStorageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userStorageService.user$.subscribe((user) => {
      if (user && user.userId) {
        this.doctorId = user.userId;
      } else {
        console.log('No user found or userId is undefined');
      }
    });
    this.loadAppointments();
    this.getAllPatients();
  }

  getAllPatients(): void {
    this.authService.getAllPatients().subscribe(
      (data) => {
        this.patients = data;
        console.log(this.patients);

        this.filterPatientsWithAcceptedAppointments();
      },
      (error: any) => {
        console.error('Failed to retrieve patients:', error);
      }
    );
  }

  loadAppointments() {
    this.appointmentService.getAppointmentsForDoctor(this.doctorId).subscribe(
      (data) => {
        this.appointments = data.reverse();
        console.log(this.appointments);
      },
      (error) => console.error('Error loading appointments', error)
    );
  }

  filterPatientsWithAcceptedAppointments() {
    // Get all accepted appointment IDs as strings
    const acceptedAppointmentIds = this.appointments
      .filter((appointment) => appointment.status === 'ACCEPTED')
      .map((appointment) => appointment.patient.id.toString()); // Ensure it is a string

    console.log('Accepted Appointment Patient IDs:', acceptedAppointmentIds);

    // Now filter the patients list based on whether their ID exists in the accepted appointments
    this.patientsWithAcceptedAppointments = this.patients.filter(
      (patient) => acceptedAppointmentIds.includes(patient.id.toString()) // Convert to string before comparison
    );

    console.log(
      'Filtered Patients with Accepted Appointments:',
      this.patientsWithAcceptedAppointments
    );
  }
  navigateToMedicalFile(patientId: number) {
    this.router.navigate(['/medical-file', patientId, this.doctorId]);
  }
}
