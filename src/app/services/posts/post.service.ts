import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = `${environment.apiBaseUrl}/posts/`;
  constructor(private http: HttpClient) { }

  createPost(post: { content: string, authorName: string, authorId: number, postImage?: File }): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('content', post.content);
    formData.append('authorName', post.authorName);
    formData.append('authorId', post.authorId.toString());

    // Append the image if available
    if (post.postImage) {
      formData.append('postImage', post.postImage, post.postImage.name);
    }

    return this.http.post(this.apiUrl + 'add', formData);
  }
  
  

  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+"allpost");
  }

  addComment(postId: number, comment: { content: string }, username: string, authorId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}comment/${postId}/comments?username=${username}&authorId=${authorId}`, comment);
}

  // Like a post
  likePost(postId: number, username: string,authorId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}like/${postId}/likes?username=${username}&authorId=${authorId}`, {});
  }


  deletePost(postId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}delpost/${postId}`);
  }
  
  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}delcom/${commentId}`);
  }

  updatePost(postId: number, content: string, authorName: string, authorId: number, postImage?: File): Observable<any> {
    const formData = new FormData();
    formData.append('content', content);
    formData.append('authorName', authorName);
    formData.append('authorId', authorId.toString());
    if (postImage) {
      formData.append('postImage', postImage);
    }
  
    return this.http.put<any>(`${this.apiUrl}update/${postId}`, formData);
  }
  
  
}
