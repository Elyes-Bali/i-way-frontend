import { Component } from '@angular/core';
import { UserDto, UserDetails } from '../models/user.model';
import { AuthService } from '../services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { UserStorageService } from '../services/storage/user-storage.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent {
  userId: number;
  userDetails: UserDetails = new UserDetails();
  image: File;
  signature: File;
  imagePreview!: string | ArrayBuffer | null;
  signaturePreview!: string | ArrayBuffer | null;
  isDoctorLoggedIn : boolean = UserStorageService.isDoctorLoggedIn();
  isPharmacyLoggedIn: boolean = UserStorageService.isPharmacyLoggedIn();
  isLoading: boolean = false;
  constructor(private userService: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['id'];  
      this.getUserDetails();
      this.isDoctorLoggedIn = UserStorageService.isDoctorLoggedIn();
      this.isPharmacyLoggedIn = UserStorageService.isPharmacyLoggedIn();
    });
  }

  getUserDetails() {
    this.userService.getuserId(this.userId).subscribe(data => {
      this.userDetails = data;
      console.log(this.userDetails);

      // If there's an image URL, set it for preview
      if (this.userDetails.imgUrl) {
        this.imagePreview = this.userDetails.imgUrl;
      }
      if (this.userDetails.signatureUrl) {
        this.signaturePreview = this.userDetails.signatureUrl;
      }
      if (data.birthDate) {
        this.userDetails.birthDate = new Date(data.birthDate).toISOString().split('T')[0];
      }
      
      
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.image = file;

      // Preview the image
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSignatureChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.signature = file;

      // Preview the signature
      const reader = new FileReader();
      reader.onload = (e) => {
        this.signaturePreview = e.target?.result;
      };
      reader.readAsDataURL(file);
    }
  }

  updateUser() {
    this.isLoading = true;
    if (this.signature) {
      const formData = new FormData();
      formData.append('image_file', this.signature);
      formData.append('size', 'auto');
  
      fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': 'hK5oMd1wJhPEupRKVqgUBeAW',
        },
        body: formData,
      })
        .then(response => response.blob())
        .then(blob => {
          const file = new File([blob], 'signature.png', { type: 'image/png' });
  
          // Update the signature with the new transparent version
          this.signature = file;
  
          // Proceed with updating the user
          this.submitUserUpdate();
        })
        .catch(error => {
          console.error('Error removing signature background:', error);
          alert('Failed to process signature background. Please try again.');
        });
    } else {
      // If no signature, proceed with updating
      this.submitUserUpdate();
    }
  }
  
  submitUserUpdate() {
    this.userService.updateUser(
      this.userId,
      this.userDetails.name,
      this.userDetails.email,
      this.userDetails.education,
      this.userDetails.experience,
      this.userDetails.statement,
      this.userDetails.skills,
      this.userDetails.adress,
      this.userDetails.number,
      this.userDetails.eaddress,
      this.userDetails.speciality,
      this.userDetails.matricule,
      this.userDetails.verified,
      this.image,
      this.signature,
      this.userDetails.birthDate
    ).subscribe(
      (updatedUser) => {
        console.log('User updated successfully', updatedUser);
        alert('Profile updated successfully!');
        this.isLoading = false;
      },
      (error) => {
        console.error('Error updating user', error);
        alert('An error occurred while updating your profile.');
        this.isLoading = false;
      }
    );
  }
  

}
