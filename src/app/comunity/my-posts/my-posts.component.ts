import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/posts/post.service';
import { UserStorageService } from 'src/app/services/storage/user-storage.service';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.css'],
})
export class MyPostsComponent implements OnInit {
  posts: any[] = [];
  userId: number;
  editingPostId: number | null = null;  // Track which post is being edited
  updatedContent: string = '';
  selectedImage: File | null = null;
username:string
  constructor(
    private postService: PostService,
    private userStorageService: UserStorageService
  ) {}

  ngOnInit(): void {
    this.userStorageService.user$.subscribe((user) => {
      if (user && user.userId) {
        this.userId = user.userId;
        this.username= user.name
        console.log("User ID loaded: ", this.userId);
      } else {
        console.log("No user found or userId is undefined");
      }
    });
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe((posts) => {
      console.log("Posts received:", posts);
      this.posts = posts
        .map((post) => ({
          ...post,
          authorid: Number(post.authorid),
          likes: post.likes
            ? post.likes.map((like) => ({ authorId: Number(like.authorid) }))
            : [],
          showFullContent: false,
        }))
        .filter((post) => {
          return post.authorid === this.userId || !this.userId;
        })
        .reverse();
    });
  }

  startEditing(post: any): void {
    this.editingPostId = post.id;
    this.updatedContent = post.content;  // Populate the input field with the current content
  }

  cancelEditing(): void {
    this.editingPostId = null;
    this.updatedContent = '';
    this.selectedImage = null;
  }

  onImageChange(event: any): void {
    this.selectedImage = event.target.files[0];
  }

  updatePost(postId: number): void {
    this.postService.updatePost(postId, this.updatedContent, this.username, this.userId, this.selectedImage).subscribe(
      (response) => {
  
        const updatedPost = this.posts.find((post) => post.id === postId);
        if (updatedPost) {
          updatedPost.content = this.updatedContent;
          updatedPost.postImage = response.postImage; 
        }
        this.cancelEditing();  
        console.log('Post updated successfully:', response);
      },
      (error) => {
        console.error('Error updating post:', error);
      }
    );
  }

  deletePost(postId: number): void {
    this.postService.deletePost(postId).subscribe(() => {
      this.posts = this.posts.filter((post) => post.id !== postId);
    });
  }
}
