import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SavedPostService {
  private apiUrl = `${environment.apiBaseUrl}/saved-posts/`;

  constructor(private http: HttpClient) {}

  savePost(userId: number, postId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add/${userId}/${postId}`, {}); // Remove responseType: 'text'
  }
  
  

  getSavedPosts(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all/${userId}`);
  }
  

  removeSavedPost(userId: number, postId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${userId}/${postId}`, { responseType: 'text' });
  }
  
}
