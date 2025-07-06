import { Component, OnInit } from '@angular/core';
import { DoctorAvailability } from '../models/doctor-availability.model';
import { DoctorAvailabilityService } from '../services/doctor/doctor-availability.service';
import { UserStorageService } from '../services/storage/user-storage.service';
import { HttpHeaders } from '@angular/common/http';
import { UserDetails } from '../models/user.model';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css'],
})
export class DoctorComponent implements OnInit {
  userDetails: UserDetails = new UserDetails();
  imagePreview!: string | ArrayBuffer | null;
  doctorId: number = 0;
  doctorName: string = 'Dr. John Doe'; // Replace with actual fetched doctor name
  doctorSpecialty: string = 'Cardiologist'; // Replace with actual fetched specialty
  availabilityList: DoctorAvailability[] = [];
  availability: DoctorAvailability = {
    doctorId: 0,
    dayOfWeek: '',
    startTime: '',
    endTime: '',
    secondTime: '',
    secondendTime: '',
    thirdTime: '',
    thirdendTime: '',
  };
  isLoading: boolean = false;
  errorMessage: string = '';
  showSuccessMessage: boolean = false;
  showDeleteMessage: boolean = false;
  showMoreSlots = false; 
  constructor(private availabilityService: DoctorAvailabilityService,private userService: AuthService) {}

  ngOnInit() {
    this.doctorId = Number(UserStorageService.getUserId());
    this.loadAvailability();
    this.getUserDetails();
  }

  getUserDetails() {
    this.userService.getuserId(this.doctorId).subscribe(data => {
      this.userDetails = data;
      console.log(this.userDetails);
      if (this.userDetails.imgUrl) {
        this.imagePreview = this.userDetails.imgUrl;
      }
    });
  }

  setAvailability() {
    this.availability.doctorId = this.doctorId;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${UserStorageService.getToken()}`
    );

    this.isLoading = true;
    this.errorMessage = '';
    this.showSuccessMessage = false; // Hide previous success message

    this.availabilityService
      .addAvailability([this.availability], headers, this.doctorId)
      .subscribe(
        (response) => {
          this.isLoading = false;
          this.showSuccessMessage = true; // ✅ Show success message

          // ✅ Fetch updated availability list after setting availability
          this.loadAvailability();

          // ✅ Auto-hide success message after 3 seconds
          setTimeout(() => (this.showSuccessMessage = false), 3000);

          // Reset availability form
          this.availability = {
            doctorId: this.doctorId,
            dayOfWeek: '',
            startTime: '',
            endTime: '',
            secondTime: '',
            secondendTime: '',
            thirdTime: '',
            thirdendTime: '',
          };
        },
        (error) => {
          console.error(error);
          this.errorMessage = 'Failed to set availability. Please try again.';
          this.isLoading = false;
        }
      );
  }

  deleteAvailability(id: number) {
    if (confirm('Are you sure you want to delete this availability?')) {
      this.availabilityService.deleteAvailabilitie(id).subscribe(
        () => {
          this.showDeleteMessage = true; // ✅ Show delete success message
          this.loadAvailability(); // ✅ Refresh list

          // Auto-hide success message after 3 seconds
          setTimeout(() => (this.showDeleteMessage = false), 3000);
        },
        (error) => {
          console.error('Error deleting availability:', error);
          this.errorMessage =
            'Failed to delete availability. Please try again.';
        }
      );
    }
  }

  loadAvailability() {
    this.availabilityService.getDoctorAvailability(this.doctorId).subscribe(
      (data) => {
        this.availabilityList = [...data]; // ✅ Ensure fresh data is used
      },
      (error) => console.error('Error fetching availability:', error)
    );
  }
}
