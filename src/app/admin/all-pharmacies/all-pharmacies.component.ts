import { Component } from '@angular/core';
import { UserDetails } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-all-pharmacies',
  templateUrl: './all-pharmacies.component.html',
  styleUrls: ['./all-pharmacies.component.css']
})
export class AllPharmaciesComponent {
  pharmacies: UserDetails[] = [];
  searchTerm: string = ''; 
  filtereddocs: UserDetails[] = [];
  pageSize = 10; 
  currentPage = 1; // Current page
  totalPages = 0; // Total number of pages
  pages: number[] = []; // Array of page numbers
  pagedocs: UserDetails[] = [];

 constructor(
   private authService: AuthService
 ) {}

  ngOnInit() {
 
     this.getAllDoctors(); 
   }


   getAllDoctors(): void {
     this.authService.getAllPharmacy().subscribe(
       (data) => {
         this.pharmacies = data;
         console.log(this.pharmacies); // Debugging to check if doctors are fetched
         this.filterDocs(); // Ensure filtering and pagination happen after data is fetched
       },
       (error: any) => {
         console.error('Failed to retrieve pharmacies:', error);
       }
     );
   }
   

   filterDocs(): void {
     if (!this.searchTerm.trim()) {
       this.filtereddocs = [...this.pharmacies]; // Use spread operator to avoid reference issues
     } else {
       this.filtereddocs = this.pharmacies.filter(
         (docs) =>
           docs?.email?.toLowerCase().includes(this.searchTerm.toLowerCase().trim()) ||
           docs?.speciality?.toLowerCase().includes(this.searchTerm.toLowerCase().trim())
       );
     }
   
     this.updatePagination(); // Call pagination update function
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


 toggleVerificationStatus(pharmacies: UserDetails): void {
   const newVerificationStatus = !pharmacies.verified;
 
   this.authService.updateUser(
     pharmacies.id,
     pharmacies.name,  
     pharmacies.email,  
     pharmacies.education,  
     pharmacies.experience,  
     pharmacies.statement,  
     pharmacies.skills,  
     pharmacies.adress,  
     pharmacies.number,  
     pharmacies.eaddress,  
     pharmacies.speciality,  
     pharmacies.matricule,  
     newVerificationStatus,  
     null  
   ).subscribe(
     (response) => {
       pharmacies.verified = newVerificationStatus; 
       console.log('pharmacy verification status updated:', response);
     },
     (error) => {
       console.error('Error updating verification status:', error);
     }
   );
 }
 

 
}

