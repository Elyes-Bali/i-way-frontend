import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDetails } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserStorageService } from 'src/app/services/storage/user-storage.service';

@Component({
  selector: 'app-doc-sidebar',
  templateUrl: './doc-sidebar.component.html',
  styleUrls: ['./doc-sidebar.component.css'],
})
export class DocSidebarComponent {
  userId: number;
  userDetails: UserDetails = new UserDetails();
  image: File;
  imagePreview!: string | ArrayBuffer | null;
  isPatientLoggedIn: boolean = UserStorageService.isPatientLoggedIn();
  isDoctorLoggedIn: boolean = UserStorageService.isDoctorLoggedIn();
  constructor(
    private userService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private userStorageService: UserStorageService
  ) {}

  ngOnInit() {
    this.userStorageService.user$.subscribe((user) => {
      if (user && user.userId) {
        this.userId = user.userId;
        console.log('User ID loaded: ', this.userId); // Log the userId to check
      } else {
        console.log('No user found or userId is undefined');
      }
    });
    this.route.params.subscribe((params) => {
      this.getUserDetails();
      this.isDoctorLoggedIn = UserStorageService.isDoctorLoggedIn();
      this.isPatientLoggedIn = UserStorageService.isPatientLoggedIn();
    });
  }

  getUserDetails() {
    this.userService.getuserId(this.userId).subscribe((data) => {
      this.userDetails = data;
      console.log(this.userDetails);
      if (this.userDetails.imgUrl) {
        this.imagePreview = this.userDetails.imgUrl;
      }
    });
  }

  navigateToProfile() {
    if (this.userId !== null) {
      this.router.navigate(['/docprofile', this.userId]);
    }
  }

  navigateToAppointments() {
    if (this.userId !== null) {
      this.router.navigate(['/docs/allapointments', this.userId]);
    }
  }

  navigateToUpdate() {
    if (this.userId !== null) {
      this.router.navigate(['/update-user', this.userId]);
    }
  }

  navigateToPosts() {
    this.router.navigate(['/my-posts']);
  }

  navigateToSavedPosts() {
    this.router.navigate(['/saved-posts']);
  }

  navigateToPatients() {
    this.router.navigate(['/mypatients']);
  }

  navigateToPrescription() {
    this.router.navigate(['/myprescription']);
  }

  navigateToReclamations() {
    this.router.navigate(['/profile/reclamations']);
  }

  navigateToConversations() {
    this.router.navigate(['/chatting']);
  }

  navigateToAvailability() {
    this.router.navigate(['/doctor']);
  }

  patientAppointments() {
    if (this.userId !== null) {
      this.router.navigate(['/patient/allapointments', this.userId]);
    }
  }
}
