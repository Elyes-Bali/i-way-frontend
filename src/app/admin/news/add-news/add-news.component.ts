import { Component, OnInit } from '@angular/core';
import { NewsService } from 'src/app/services/news/news.service';


@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.css']
})
export class AddNewsComponent implements OnInit {
  newsList: any[] = [];
  newTitle: string = '';
  newContent: string = '';
  newsImage?: File;
  isLoading = false;

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

  onFileSelected(event: any) {
    this.newsImage = event.target.files[0];
  }

  addNews() {
    if (!this.newTitle || !this.newContent) {
      alert('Title and content are required!');
      return;
    }

    this.isLoading = true;
    const newsData = {
      title: this.newTitle,
      content: this.newContent,
      newsImage: this.newsImage
    };

    this.newsService.createNews(newsData).subscribe(
      () => {
        alert('News added successfully!');
        this.newTitle = '';
        this.newContent = '';
        this.newsImage = undefined;
        this.loadNews(); // Refresh list
        this.isLoading = false;
      },
      (error) => {
        console.error('Error adding news:', error);
        alert('Failed to add news');
        this.isLoading = false;
      }
    );
  }

  deleteNews(id: number) {
    if (confirm('Are you sure you want to delete this news?')) {
      this.newsService.deleteNews(id).subscribe(
        () => {
          alert('News deleted successfully!');
          this.loadNews(); // Refresh list
        },
        (error) => {
          console.error('Error deleting news:', error);
          alert('Failed to delete news');
        }
      );
    }
  }
}
