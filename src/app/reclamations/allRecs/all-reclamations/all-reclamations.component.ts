import { Component, OnInit } from '@angular/core';
import { Reclamations } from 'src/app/models/ReclamationsM';
import { ReclamationsService } from 'src/app/services/reclamations/reclamations.service';

@Component({
  selector: 'app-all-reclamations',
  templateUrl: './all-reclamations.component.html',
  styleUrls: ['./all-reclamations.component.css']
})
export class AllReclamationsComponent implements OnInit{
  sortOption: string = 'name';
  recs: Reclamations[] = [];
  searchTerm: string = ''; 
  filteredRecs: Reclamations[] = [];
  pageSize = 8; 
  currentPage = 1; // Current page
  totalPages = 0; // Total number of pages
  pages: number[] = []; // Array of page numbers
  pagedProducts: Reclamations[] = [];
 
 
  constructor(private reclamationService: ReclamationsService) {}


  ngOnInit(): void {
    this.loadReclamations();
    
  }
 
  loadReclamations() {
    this.reclamationService.getAllReclamations().subscribe(
      (data) => {
        this.recs = data.reverse();
        console.log(this.recs);
        this.filterProducts(); // Call filter function after receiving data
        this.updatePagination(); // Call pagination update function
      },
      (error) => {
        console.error('Error loading Reclamations:', error);
      }
    );
  }

  filterProducts(): void {
    if (!this.searchTerm.trim()) {
      this.filteredRecs = this.recs;
    } else {
      this.filteredRecs = this.recs.filter(
        (recs) =>
          recs?.email
            ?.toLowerCase()
            ?.includes(this.searchTerm.toLowerCase().trim()) ||
          recs?.description
            ?.toLowerCase()
            ?.includes(this.searchTerm.toLowerCase().trim())
      );
    }
    
    this.updatePagination(); // Call pagination update function
  }


  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredRecs.length / this.pageSize);

    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }

    this.goToPage(1);
  }

  goToPage(page: number): void {
    this.currentPage = page;

    const startIndex = (page - 1) * this.pageSize;

    this.pagedProducts = this.filteredRecs.slice(
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


deleteReclamation(id: number): void {
  // Confirm deletion with the user
  const confirmDeletion = window.confirm('Are you sure you want to delete this reclamation?');
  
  if (confirmDeletion) {
    this.reclamationService.deleteReclamation(id).subscribe(
      () => {
        // Refresh the list of reclamations after deletion
        this.loadReclamations();
      },
      (error) => {
        console.error('Error deleting reclamation:', error);
      }
    );
  }
}

getFormattedContent(description: string): string {
  return description.replace(/\n/g, '<br>').replace(/  /g, '&nbsp;&nbsp;');
}


}

