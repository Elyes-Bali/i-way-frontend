import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MedicalFileService } from 'src/app/services/medicalFile/medical-file.service';
import { UserStorageService } from 'src/app/services/storage/user-storage.service';

@Component({
  selector: 'app-prescriptions',
  templateUrl: './prescriptions.component.html',
  styleUrls: ['./prescriptions.component.css'],
})
export class PrescriptionsComponent implements OnInit {
  patientId: number;
  allMedicalFiles: any[] = [];
  filteredMedicalFiles: any[] = [];
  currentIndex: number = 0;

  constructor(
    private userService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private userStorageService: UserStorageService,
    private medicalFileService: MedicalFileService
  ) {}

  ngOnInit() {
    this.userStorageService.user$.subscribe((user) => {
      if (user && user.userId) {
        this.patientId = user.userId;
        console.log('Patient ID loaded: ', this.patientId);
        this.loadMedicalFiles(); // Load medical files after getting the user
      } else {
        console.log('No user found or userId is undefined');
      }
    });
  }

  loadMedicalFiles(): void {
    this.medicalFileService.getMedicalFiles().subscribe((allMedicalFiles) => {
      this.filteredMedicalFiles = allMedicalFiles
        .filter((file) => file.patient.id === this.patientId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Sort by newest

      this.currentIndex = 0; // Show the latest prescription first
      console.log(this.filteredMedicalFiles)
    });
  }

  prevPrescription(): void {
    if (this.currentIndex > 0) this.currentIndex--;
  }

  nextPrescription(): void {
    if (this.currentIndex < this.filteredMedicalFiles.length - 1) this.currentIndex++;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const yy = date.getFullYear().toString().slice(-4);
    const dd = date.getDate().toString().padStart(2, '0');
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${yy}/${dd}/${mm}`;
  }

  getFormattedContent(content: string): string {
    // Convert newlines to <br> and preserve spaces using <pre> tag
    return content.replace(/\n/g, '<br>').replace(/  /g, '&nbsp;&nbsp;');
  }
}
