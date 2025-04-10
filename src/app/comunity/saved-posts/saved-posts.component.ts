import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SavedPostService } from 'src/app/services/savedPosts/saved-post.service';
import { UserStorageService } from 'src/app/services/storage/user-storage.service';

@Component({
  selector: 'app-saved-posts',
  templateUrl: './saved-posts.component.html',
  styleUrls: ['./saved-posts.component.css']
})
export class SavedPostsComponent implements OnInit {
  savedPosts: any[] = [];
  userId: number;
  currentPage: number = 0;
  postsPerPage: number = 2;
  paginatedPosts: any[] = [];

  constructor(private savedPostService: SavedPostService, private userStorageService: UserStorageService) {}

  ngOnInit(): void {
      this.userStorageService.user$.subscribe((user) => {
          if (user && user.userId) {
              this.userId = user.userId;
          }
      });
      this.loadSavedPosts();
  }

  loadSavedPosts() {
      this.savedPostService.getSavedPosts(this.userId).subscribe(posts => {
          this.savedPosts = posts;
          this.updatePagination();
      });
  }

  removePost(postId: number) {
      this.savedPostService.removeSavedPost(this.userId, postId).subscribe(() => {
          this.savedPosts = this.savedPosts.filter(post => post.id !== postId);
          this.updatePagination();
      });
  }

  updatePagination() {
      const start = this.currentPage * this.postsPerPage;
      this.paginatedPosts = this.savedPosts.slice(start, start + this.postsPerPage);
  }

  prevPage() {
      if (this.currentPage > 0) {
          this.currentPage--;
          this.updatePagination();
      }
  }

  nextPage() {
      if ((this.currentPage + 1) * this.postsPerPage < this.savedPosts.length) {
          this.currentPage++;
          this.updatePagination();
      }
  }
}