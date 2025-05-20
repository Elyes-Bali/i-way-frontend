import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Appointment, AppointmentStatus } from 'src/app/models/appointment.model';
import { AppointmentsService } from 'src/app/services/appointments/appointments.service';
import { WebSocketServiceService } from 'src/app/services/webSocket/web-socket-service.service';

@Component({
  selector: 'app-patient-appointments',
  templateUrl: './patient-appointments.component.html',
  styleUrls: ['./patient-appointments.component.css']
})
export class PatientAppointmentsComponent implements OnInit {
  patientId: number;
  appointments: Appointment[] = [];
  notifications: any[] = [];
  pageSize = 10; // Number of appointments per page
  currentPage = 1;
  constructor(private appointmentService: AppointmentsService, private route: ActivatedRoute,  private webSocketService: WebSocketServiceService) {}

  ngOnInit() {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAppointments();

    this.webSocketService.subscribeToNotifications(this.patientId);
    this.webSocketService.getNotifications().subscribe(notification => {
      console.log("Notification received:", notification);
      this.notifications.push(notification);
      console.log(this.notifications)
    });
  }

  loadAppointments() {
    this.appointmentService.getAppointmentsForPatient(this.patientId).subscribe(
      (data) => {
        console.log(data); // Debugging: check the received data
        this.appointments = data.reverse(); // Reverse the order
      },
      (error) => console.error('Error loading appointments', error)
    );
  }
  

  getStatusText(status: AppointmentStatus): string {
    switch (status) {
      case AppointmentStatus.PENDING:
        return 'Pending';
      case AppointmentStatus.ACCEPTED:
        return 'Accepted';
      case AppointmentStatus.REJECTED:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  }

  getStatusClass(status: AppointmentStatus): string {
    switch (status) {
      case AppointmentStatus.PENDING:
        return 'text-warning';
      case AppointmentStatus.ACCEPTED:
        return 'text-success';
      case AppointmentStatus.REJECTED:
        return 'text-danger';
      default:
        return 'text-muted';
    }
  }

  cancelAppointment(appointmentId: number) {
    this.appointmentService.cancelAppointment(appointmentId).subscribe({
      next: () => {
        this.loadAppointments(); // Refresh list
      },
      error: (err) => {
        console.error("Error canceling appointment", err);
      }
    });
  }
  


  get paginatedAppointments(): Appointment[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.appointments.slice(startIndex, startIndex + this.pageSize);
  }

  changePage(step: number) {
    this.currentPage += step;
  }

}
