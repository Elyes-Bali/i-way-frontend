import { Component } from '@angular/core';
import { UserDetails } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-all-patients',
  templateUrl: './all-patients.component.html',
  styleUrls: ['./all-patients.component.css'],
})
export class AllPatientsComponent {
  patients: UserDetails[] = [];
  searchTerm: string = '';
  filtereddocs: UserDetails[] = [];
  pageSize = 10;
  currentPage = 1; // Current page
  totalPages = 0; // Total number of pages
  pages: number[] = []; // Array of page numbers
  pagedocs: UserDetails[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.getAllPatients();
  }

  getAllPatients(): void {
    this.authService.getAllPatients().subscribe(
      (data) => {
        this.patients = data;
        console.log(this.patients); 
        this.filterDocs(); 
      },
      (error: any) => {
        console.error('Failed to retrieve patients:', error);
      }
    );
  }

  filterDocs(): void {
    if (!this.searchTerm.trim()) {
      this.filtereddocs = [...this.patients]; // Use spread operator to avoid reference issues
    } else {
      this.filtereddocs = this.patients.filter(
        (docs) =>
          docs?.email
            ?.toLowerCase()
            .includes(this.searchTerm.toLowerCase().trim()) ||
          docs?.name
            ?.toLowerCase()
            .includes(this.searchTerm.toLowerCase().trim())
      );
    }

    this.updatePagination(); // Call pagination update function
  }



  toggleVerificationStatus(patients: UserDetails): void {
    const newVerificationStatus = !patients.verified;
  
    this.authService.updateUser(
      patients.id,
      patients.name,  
      patients.email,  
      patients.education,  
      patients.experience,  
      patients.statement,  
      patients.skills,  
      patients.adress,  
      patients.number,  
      patients.eaddress,  
      patients.speciality,  
      patients.matricule,  
      newVerificationStatus,  
      null  
    ).subscribe(
      (response) => {
        patients.verified = newVerificationStatus; 
        console.log('Doctor verification status updated:', response);
      },
      (error) => {
        console.error('Error updating verification status:', error);
      }
    );
  }





  updatePagination(): void {
    this.totalPages = Math.ceil(this.filtereddocs.length / this.pageSize);

    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }

    this.goToPage(1);
  }

  goToPage(page: number): void {
    this.currentPage = page;

    const startIndex = (page - 1) * this.pageSize;

    this.pagedocs = this.filtereddocs.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }
}
