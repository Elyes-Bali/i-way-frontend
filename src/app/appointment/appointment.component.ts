import { Component, OnInit } from '@angular/core';
import { DoctorAvailabilityService } from '../services/doctor/doctor-availability.service';
import { AppointmentsService } from '../services/appointments/appointments.service';
import { UserStorageService } from '../services/storage/user-storage.service';
import { Appointment, BookingResponse } from '../models/appointment.model';
import { User, UserDetails } from '../models/user.model';
import { AuthService } from '../services/auth/auth.service';

declare var $: any; // Add this to use jQuery for Bootstrap modal

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css'],
})
export class AppointmentComponent implements OnInit {
  patientId: number = 0;
  isLoading = true; 
  selectedSpecialty: string = ''; 
  searchName: string = '';

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 20;

  availableDoctors: {
    id: number;
    username: string;
    specialty: string;
    imgUrl?: string;
    experience?: string;
    education?: string;
  }[] = [];

  doctors: UserDetails[] = [];

  constructor(
    private availabilityService: DoctorAvailabilityService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.patientId = Number(UserStorageService.getUserId());
    this.getAllDoctors();
  }

  getAllDoctors(): void {
    this.authService.getAllDoctors().subscribe(
      (data) => {
        this.doctors = data;
        this.getAvailableDoctors();
      },
      (error: any) => {
        console.error('Failed to retrieve doctors:', error);
      }
    );
  }

  getAvailableDoctors() {
    this.isLoading = true;
    
    this.availabilityService.getAllDoctorAvailabilities().subscribe((data) => {
      if (this.doctors.length > 0) {
        this.availableDoctors = data.map((availability: any) => {
          const doctorDetails = this.doctors.find(
            (doc) => doc.id === availability.doctor.id
          );
          return {
            id: availability.doctor.id,
            username: availability.doctor.name,
            specialty: doctorDetails ? doctorDetails.speciality : 'Unknown',
            imgUrl: doctorDetails
              ? doctorDetails.imgUrl
              : 'assets/default-doctor.png',
            experience: doctorDetails ? doctorDetails.experience : '',
            education: doctorDetails ? doctorDetails.education : '',
            skills: doctorDetails ? doctorDetails.skills : '',
          };
        });

        // Remove duplicate doctors
        this.availableDoctors = this.availableDoctors.filter(
          (doctor, index, self) =>
            index === self.findIndex((d) => d.id === doctor.id)
        );
      }

      this.isLoading = false;
    });
  }

  get filteredDoctors() {
    let doctors = this.availableDoctors.filter((doctor) => {
      const matchesSpecialty = !this.selectedSpecialty || doctor.specialty === this.selectedSpecialty;
      const matchesName = !this.searchName || doctor.username.toLowerCase().includes(this.searchName.toLowerCase());
      return matchesSpecialty && matchesName;
    });

    // Paginate results
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return doctors.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Get total pages
  get totalPages(): number {
    return Math.ceil(this.availableDoctors.length / this.itemsPerPage);
  }

  // Change page
  changePage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
