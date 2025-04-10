import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MedicalFileService } from 'src/app/services/medicalFile/medical-file.service';
import { UserStorageService } from 'src/app/services/storage/user-storage.service';

@Component({
  selector: 'app-search-prescriptions',
  templateUrl: './search-prescriptions.component.html',
  styleUrls: ['./search-prescriptions.component.css'],
})
export class SearchPrescriptionsComponent implements OnInit {
  allMedicalFiles: any[] = [];
  filteredMedicalFiles: any[] = []; // To store filtered files
  searchCode: string = ''; // Bind the search input to this variable
  currentIndex: number = 0;
  constructor(
    private userService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private userStorageService: UserStorageService,
    private medicalFileService: MedicalFileService
  ) {}

  ngOnInit() {
    
  }

  filterFiles(): void {
    if (this.searchCode) {
      // Load the files only when the user starts typing
      if (this.allMedicalFiles.length === 0) {
        this.medicalFileService.getMedicalFiles().subscribe(
          (data) => {
            this.allMedicalFiles = data; // Fetch files only once
            console.log(this.allMedicalFiles)
            // Filter only the files that match the entered code
            this.filteredMedicalFiles = this.allMedicalFiles.filter(
              (file) => file.code.toLowerCase() === this.searchCode.toLowerCase()
            );
          },
          (error) => {
            console.error('Error fetching medical files:', error);
          }
        );
      } else {
        // If files are already loaded, just filter them
        this.filteredMedicalFiles = this.allMedicalFiles.filter(
          (file) => file.code.toLowerCase() === this.searchCode.toLowerCase()
        );
      }
    } else {
      // If no code is typed, clear the filtered results
      this.filteredMedicalFiles = [];
    }
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
