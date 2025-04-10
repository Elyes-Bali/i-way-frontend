import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDetails } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PostService } from 'src/app/services/posts/post.service';
import { SavedPostService } from 'src/app/services/savedPosts/saved-post.service';
import { UserStorageService } from 'src/app/services/storage/user-storage.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit {
  posts: any[] = [];
  newPostContent: string = '';
  commentContent: { [key: number]: string } = {};
  userId: number;
  username: string;
  authorId: number;
  doctors: UserDetails[] = [];
  imagePreview!: string | ArrayBuffer | null;
  userDetails: UserDetails = new UserDetails();
  imagePost!: string | ArrayBuffer | null;
  isDoctorLoggedIn: boolean = UserStorageService.isDoctorLoggedIn();
  selectedImage: File | null = null;
  savedPosts: any[] = [];
  activeUsers: UserDetails[] = [];
  isLoading: boolean = false;
  selectedPhoto: string | null = null;
  constructor(
    private postService: PostService,
    private userStorageService: UserStorageService,
    private authService: AuthService,
    private userService: AuthService,
    private router: Router,
    private savedPostService: SavedPostService
  ) {}

  ngOnInit(): void {
    this.userStorageService.user$.subscribe((user) => {
      if (user && user.userId) {
        this.userId = user.userId;
        this.authorId = user.userId;
        this.username = user.name;
        this.loadSavedPosts();
      }
    });
    this.router.events.subscribe((event) => {
      this.isDoctorLoggedIn = UserStorageService.isDoctorLoggedIn();
    });

    this.loadPosts();
    this.getAllDoctors();
    this.getUserDetails();
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe((posts) => {
      this.posts = posts
        .map((post) => ({
          ...post,
          authorid: Number(post.authorid),
          likes: post.likes
            ? post.likes.map((like) => ({ authorId: Number(like.authorid) }))
            : [],
          showFullContent: false,
        }))
        .reverse();
        this.calculateMostActiveUsers();
    });
  }

  toggleReadMore(post: any): void {
    post.showFullContent = !post.showFullContent;
  }

  getTruncatedContent(content: string): string {
    return content.length > 500 ? content.substring(0, 500) + '...' : content;
  }

  getAllDoctors(): void {
    this.authService.getAllDoctors().subscribe(
      (data) => {
        this.doctors = data;
        console.log('all-doctors', this.doctors);
      },
      (error: any) => {
        console.error('Failed to retrieve doctors:', error);
      }
    );
  }

  getDoctorImage(authorId: number): string {
    const doctor = this.doctors.find((doctor) => doctor.id === authorId);
    return doctor ? doctor.imgUrl : ''; // Return the imgUrl if found, otherwise an empty string
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
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePost = reader.result; // Show preview
      };
      reader.readAsDataURL(file);
    }
  }

  createPost(): void {
    if (this.newPostContent) {
      const authorName = this.username;
      this.isLoading = true;
      this.postService
        .createPost({
          content: this.newPostContent,
          authorName,
          authorId: this.authorId,
          postImage: this.selectedImage, 
        })
        .subscribe(
          (post) => {
            post.likes = [];
            post.comments = [];
            this.posts.unshift(post);
            this.newPostContent = '';
            this.selectedImage = null; // Reset image selection
            this.imagePost = null; // Reset preview
            this.isLoading = false; // Set loading to false when post is created successfully
          },
          (error) => {
            this.isLoading = false; // Set loading to false if there is an error
            console.error('Error creating post:', error);
          }
        );
    }
  }

  addComment(postId: number): void {
    const commentContent = this.commentContent[postId];
    if (commentContent) {
      this.postService
        .addComment(
          postId,
          { content: commentContent },
          this.username,
          this.authorId
        )
        .subscribe((comment) => {
          const post = this.posts.find((p) => p.id === postId);
          if (post) {
            post.comments.push(comment);
          }
          this.commentContent[postId] = '';
        });
    }
  }

  likePost(postId: number): void {
    const post = this.posts.find((p) => p.id === postId);
    if (post) {
      const alreadyLiked = post.likes.some(
        (like) => like.authorId === this.authorId
      );
      if (alreadyLiked) {
        console.log('You have already liked this post.');
        return;
      }
      this.postService
        .likePost(postId, this.username, this.authorId)
        .subscribe(() => {
          post.likes.push({ authorId: this.authorId, user: this.username });
        });
    }
  }

  deletePost(postId: number): void {
    this.postService.deletePost(postId).subscribe(() => {
      this.posts = this.posts.filter((post) => post.id !== postId);
    });
  }

  deleteComment(commentId: number, postId: number): void {
    this.postService.deleteComment(commentId).subscribe(() => {
      const post = this.posts.find((p) => p.id === postId);
      if (post) {
        post.comments = post.comments.filter(
          (comment) => comment.id !== commentId
        );
      }
    });
  }

  getFormattedContent(content: string): string {
    // Convert newlines to <br> and preserve spaces using <pre> tag
    return content.replace(/\n/g, '<br>').replace(/  /g, '&nbsp;&nbsp;');
  }

  loadSavedPosts(): void {
    this.savedPostService.getSavedPosts(this.userId).subscribe((savedPosts) => {
      this.savedPosts = savedPosts;
    });
  }
  

  savePost(post: any) {
    this.savedPostService.savePost(this.userId, post.id).subscribe((response) => {
      alert(response.message); // Extracts the "message" field
      this.savedPosts.push(post); // Add the post to the saved posts list
    });
  }
  
  removeSavedPost(post: any) {
    this.savedPostService.removeSavedPost(this.userId, post.id).subscribe((response) => {
      alert(response); // Now correctly displays "Post removed from saved"
      this.savedPosts = this.savedPosts.filter((savedPost) => savedPost.id !== post.id); // Remove from saved posts list
    });
  }
  
  isPostSaved(postId: number): boolean {
    return this.savedPosts.some((savedPost) => savedPost.id === postId);
  }
  
  calculateMostActiveUsers(): void {
    // Count posts by each user
    const userPostCounts = this.posts.reduce((counts, post) => {
      counts[post.authorid] = (counts[post.authorid] || 0) + 1;
      return counts;
    }, {});
  
    // Create an array of users and their post counts
    const activeUsersArray = Object.keys(userPostCounts).map((userId) => {
      return {
        userId: Number(userId), // Convert userId to a number
        postCount: userPostCounts[userId],
      };
    });
  
    // Sort users by post count in descending order and get the top 3
    activeUsersArray.sort((a, b) => b.postCount - a.postCount);
    const topUsers = activeUsersArray.slice(0, 3);
  
    // Fetch user details for the top 3 users
    const userObservables = topUsers.map((user) => this.authService.getuserId(user.userId));
    forkJoin(userObservables).subscribe((users) => {
      this.activeUsers = users;
    });
  }

  openImageModal(imageSrc: string): void {
    this.selectedPhoto = imageSrc;
  }
  
  closeImageModal(): void {
    this.selectedPhoto = null;
  }
  
}
// Ensure to import forkJoin from 'rxjs' at the top of your file

