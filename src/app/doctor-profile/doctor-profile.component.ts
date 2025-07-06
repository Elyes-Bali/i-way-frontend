import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDetails } from '../models/user.model';
import { AuthService } from '../services/auth/auth.service';
import { DoctorAvailabilityService } from '../services/doctor/doctor-availability.service';
import { AppointmentsService } from '../services/appointments/appointments.service';
import { UserStorageService } from '../services/storage/user-storage.service';
import { Appointment, AppointmentStatus, BookingResponse } from '../models/appointment.model';

declare var $: any; // jQuery for modal

@Component({
  selector: 'app-doctor-profile',
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css']
})
export class DoctorProfileComponent {
  isDoctorLoggedIn : boolean = UserStorageService.isDoctorLoggedIn();
  isPatientLoggedIn: boolean = UserStorageService.isPatientLoggedIn();
  userId: number;
  userDetails: UserDetails = new UserDetails();
  imagePreview!: string | ArrayBuffer | null;

  // Appointment Variables
  patientId: number = 0;
  availableDays: any[] = [];
  selectedDay: string = '';
  selectedTime: string = '';
  appointmentStatus: { message: string, type: string, icon: string } | null = null;

  constructor(
    private userService: AuthService, 
    private route: ActivatedRoute,
    private availabilityService: DoctorAvailabilityService,
    private appointmentService: AppointmentsService,
    private userStorageService: UserStorageService
  ) {}

  ngOnInit() {
    this.userId = Number(this.route.snapshot.paramMap.get('id')); // Get doctor ID from URL
    this.userStorageService.user$.subscribe(user => {
      this.userDetails = user;
      if (user.role === "PATIENT") {
        this.patientId = user.userId; // Ensure patientId is set
      }
      console.log('Patient ID:', this.patientId); // Debugging log
    });
    this.getDoctorAvailability();
    this.getUserDetails();
  }
  


  getUserDetails() {
    this.userService.getuserId(this.userId).subscribe(data => {
      this.userDetails = data;
      
      console.log(this.userDetails);
      if (this.userDetails.imgUrl) {
        this.imagePreview = this.userDetails.imgUrl;
      }
    });
  }

  // Fetch doctor's available days and times
  getDoctorAvailability() {
    if (!this.userId) {
      this.appointmentStatus = {
        message: 'Invalid doctor ID.',
        type: 'alert-danger',
        icon: 'fas fa-exclamation-circle'
      };
      return;
    }

  this.availabilityService.getDoctorAvailability(this.userId).subscribe(data => {
    this.availableDays = data.map((day: any) => {
      // Build array of time ranges if they exist
      const times = [];
      if (day.startTime && day.endTime) {
        times.push({ start: day.startTime, end: day.endTime });
      }
      if (day.secondTime && day.secondendTime) {
        times.push({ start: day.secondTime, end: day.secondendTime });
      }
      if (day.thirdTime && day.thirdendTime) {
        times.push({ start: day.thirdTime, end: day.thirdendTime });
      }
      return {
        dayOfWeek: day.dayOfWeek,
        availableTimes: times
      };
    });

    this.appointmentStatus = null;
  });
  }


bookAppointment() {
  if (!this.selectedDay || !this.selectedTime) {
    this.appointmentStatus = {
      message: 'Please select both a day and time.',
      type: 'alert-danger',
      icon: 'fas fa-exclamation-circle'
    };
    return;
  }

  // Fetch doctor's available times for the selected day
  const selectedDayData = this.availableDays.find(day => day.dayOfWeek === this.selectedDay);

  if (!selectedDayData) {
    this.appointmentStatus = {
      message: 'No availability data for the selected day.',
      type: 'alert-danger',
      icon: 'fas fa-exclamation-circle'
    };
    return;
  }

  // Check if the selected time is within any available time range
  if (this.isTimeWithinAnyRange(this.selectedTime, selectedDayData.availableTimes)) {
    // Proceed with booking if valid time
    this.appointmentService.getAppointmentsForPatient(this.patientId).subscribe(existingAppointments => {
      console.log("Checking for duplicate appointment:");
      console.log("Selected Doctor ID:", this.userId);
      console.log("Existing Appointments:", existingAppointments);

      // Check if any appointment exists with this doctor that is pending
      const pendingAppointments = existingAppointments.filter(appointment => 
        Number(appointment.doctor?.id) === this.userId && appointment.status === "PENDING"
      );

      if (pendingAppointments.length > 0) {
        // If there are any pending appointments, block new booking
        this.appointmentStatus = {
          message: 'You already have a pending appointment with this doctor. You cannot book a new one until it is accepted or rejected.',
          type: 'alert-warning',
          icon: 'fas fa-exclamation-triangle'
        };
        console.warn("Booking blocked: Existing appointment is still pending.");
        return; // Stop further execution
      }

      // Proceed with booking if no pending appointments exist
      const appointment: Appointment = {
        doctorId: this.userId,
        patientId: this.patientId,
        date: this.selectedDay,
        time: this.selectedTime,
        status: AppointmentStatus.PENDING
      };

      this.appointmentService.bookAppointment(appointment).subscribe((response: BookingResponse) => {
        if (response.status === 'success') {
          this.appointmentStatus = {
            message: response.message,
            type: 'alert-success',
            icon: 'fas fa-check-circle'
          };

          setTimeout(() => {
            $('#availabilityModal').modal('hide');
          }, 3000);
        } else {
          this.appointmentStatus = {
            message: 'Failed to book appointment. Please try again.',
            type: 'alert-danger',
            icon: 'fas fa-exclamation-circle'
          };
        }
      }, error => {
        console.error('Booking Error:', error);
        this.appointmentStatus = {
          message: 'Failed to book appointment. Please try again.',
          type: 'alert-danger',
          icon: 'fas fa-exclamation-circle'
        };
      });
    });
  } else {
    this.appointmentStatus = {
      message: `The selected time is outside the doctor's available hours. Please choose a time within the available ranges.`,
      type: 'alert-danger',
      icon: 'fas fa-exclamation-circle'
    };
  }
}


/**
 * Check if selectedTime fits in ANY of the provided time ranges.
 * @param selectedTime string in "HH:mm" format
 * @param timeRanges array of {start: string, end: string}
 * @returns true if within any range, else false
 */
isTimeWithinAnyRange(selectedTime: string, timeRanges: {start: string, end: string}[]): boolean {
  const selectedDate = this.convertToDate(selectedTime);

  for (const range of timeRanges) {
    const startDate = this.convertToDate(range.start);
    const endDate = this.convertToDate(range.end);
    if (selectedDate >= startDate && selectedDate <= endDate) {
      return true; // fits in this range
    }
  }

  return false; // not within any range
}

  // Helper function to convert time to Date object (using a fixed date)
  convertToDate(time: string): Date {
    const [hours, minutes] = time.split(':').map(Number); // Convert time to hours and minutes
    const date = new Date();
    date.setHours(hours, minutes, 0, 0); // Set hours, minutes, and zero seconds/milliseconds
    return date;
  }
  

  

  openModal() {
    $('#availabilityModal').modal('show');
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(":"); // Split into hours and minutes
    return `${hours}:${minutes}`; // Return formatted time (without seconds)
  }

 getFormattedContent(content: string | null | undefined): string {
  if (!content) {
    return '';  // return empty string if content is null/undefined/empty
  }
  return content.replace(/\n/g, '<br>').replace(/  /g, '&nbsp;&nbsp;');
}


  
}
