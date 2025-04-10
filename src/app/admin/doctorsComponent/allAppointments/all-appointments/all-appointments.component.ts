import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Appointment } from 'src/app/models/appointment.model';
import { AppointmentsService } from 'src/app/services/appointments/appointments.service';

@Component({
  selector: 'app-all-appointments',
  templateUrl: './all-appointments.component.html',
  styleUrls: ['./all-appointments.component.css']
})
export class AllAppointmentsComponent implements OnInit {
  doctorId: number ; 
  appointments: Appointment[] = [];
  pageSize = 7; 
  currentPage = 1;
  constructor(private appointmentService: AppointmentsService,private route: ActivatedRoute,private router: Router) {}

  ngOnInit() {
    this.doctorId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAppointments();
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

  acceptAppointment(appointmentId: number) {
    this.appointmentService.acceptAppointment(appointmentId).subscribe(
      () => this.loadAppointments(), // Reload appointments after update
      (error) => console.error('Error accepting appointment', error)
    );
  }

  // Reject appointment
  rejectAppointment(appointmentId: number) {
    this.appointmentService.rejectAppointment(appointmentId).subscribe(
      () => this.loadAppointments(), // Reload appointments after update
      (error) => console.error('Error rejecting appointment', error)
    );
  }

  get paginatedAppointments(): Appointment[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.appointments.slice(startIndex, startIndex + this.pageSize);
  }

  changePage(step: number) {
    this.currentPage += step;
  }


  
}
