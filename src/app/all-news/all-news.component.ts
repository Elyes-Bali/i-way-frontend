import { Component, OnInit } from '@angular/core';
import { NewsService } from '../services/news/news.service';

@Component({
  selector: 'app-all-news',
  templateUrl: './all-news.component.html',
  styleUrls: ['./all-news.component.css']
})
export class AllNewsComponent implements OnInit{
  newsList: any[] = [];
  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {
    this.newsService.getNews().subscribe(
      (data) => {
        this.newsList = data;
        console.log(this.newsList)
      },
      (error) => {
        console.error('Error fetching news:', error);
      }
    );
  }
}
