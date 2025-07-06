import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PrescriptionsService } from 'src/app/services/prescriptions/prescriptions.service';
import { UserStorageService } from 'src/app/services/storage/user-storage.service';

@Component({
  selector: 'app-my-prescriptions',
  templateUrl: './my-prescriptions.component.html',
  styleUrls: ['./my-prescriptions.component.css']
})
export class MyPrescriptionsComponent implements OnInit {
  patientId: number;
 prescriptions: any[] = [];
 currentIndex: number = 0;
  constructor(
      private userService: AuthService,
      private route: ActivatedRoute,
      private router: Router,
      private userStorageService: UserStorageService,
       private prescriptionService: PrescriptionsService
    ) {}
  
    ngOnInit() {
      this.userStorageService.user$.subscribe((user) => {
        if (user && user.userId) {
          this.patientId = user.userId;
          console.log('Patient ID loaded: ', this.patientId);
          this.loadPatientPrescriptions();
        } else {
          console.log('No user found or userId is undefined');
        }
      });
    }

      loadPatientPrescriptions(): void {
    this.prescriptionService.getPrescriptionsByPatientId(this.patientId).subscribe({
      next: (data) => {
        this.prescriptions = data.reverse();;
        console.log(data);
         this.currentIndex = 0;
      },
      error: (err) => {
        console.error('Error loading prescriptions', err);
      }
    });
  }

    formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const yy = date.getFullYear().toString().slice(-4);
    const dd = date.getDate().toString().padStart(2, '0');
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${yy}/${dd}/${mm}`;
  }

    prevPrescription(): void {
    if (this.currentIndex > 0) this.currentIndex--;
  }

  nextPrescription(): void {
    if (this.currentIndex < this.prescriptions.length - 1) this.currentIndex++;
  }

}
