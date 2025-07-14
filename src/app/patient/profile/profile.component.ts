import { Component, OnInit } from '@angular/core';
import { Reclamations } from 'src/app/models/ReclamationsM';
import { ReclamationsService } from 'src/app/services/reclamations/reclamations.service';
import { UserStorageService } from 'src/app/services/storage/user-storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  recs: Reclamations[] = [];
  filteredRecs: Reclamations[] = [];
  currentUser: number = 0;
  isPatientLoggedIn = false;
  currentPage: number = 1;
  itemsPerPage: number = 6;

  constructor(private reclamationService: ReclamationsService,private userStorageService: UserStorageService) {
    this.isPatientLoggedIn = UserStorageService.isPatientLoggedIn();
    // if (this.isPatientLoggedIn) {
    //   const user = UserStorageService.getUser();
    //   this.currentUser = user.userId;
    //   console.log('Current User ID:', this.currentUser);
    // }
  }

  ngOnInit(): void {
    this.userStorageService.user$.subscribe((user) => {
    if (user && user.userId) {
      this.currentUser = user.userId;
    this.loadReclamations();
    } else {
      console.log('No user found or userId is undefined');
    }
  });
  }

  loadReclamations() {
    this.reclamationService.getAllReclamations().subscribe(
      (data) => {
        this.recs = data.map(rec => ({
          ...rec,
          ownerId: rec.ownerId
        }));
        this.filteredRecs = this.recs.filter(rec => rec.ownerId === this.currentUser);
      },
      (error) => {
        console.error('Error loading Reclamations:', error);
      }
    );
  }

  get paginatedRecs() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredRecs.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage() {
    if ((this.currentPage * this.itemsPerPage) < this.filteredRecs.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
