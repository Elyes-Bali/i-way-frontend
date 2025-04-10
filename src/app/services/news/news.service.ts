import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiUrl = 'http://localhost:8080/news/';
  constructor(private http: HttpClient) {}

  createNews(news: {
    title: string;
    content: string;
    newsImage?: File;
  }): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('title', news.title);
    formData.append('content', news.content);

    // Append the image if available
    if (news.newsImage) {
      formData.append('newsImage', news.newsImage, news.newsImage.name);
    }

    return this.http.post(this.apiUrl + 'add', formData);
  }

  getNews(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'allnews');
  }

  deleteNews(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}delNews/${id}`);
  }
}
