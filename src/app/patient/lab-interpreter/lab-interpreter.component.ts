import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lab-interpreter',
  templateUrl: './lab-interpreter.component.html',
  styleUrls: ['./lab-interpreter.component.css']
})
export class LabInterpreterComponent {
interpretation: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    this.loading = true;
    this.interpretation = '';
    this.error = '';

    this.http.post<any>(`${environment.apiAiUrl}/interpret-lab`, formData)
      .subscribe({
        next: res => {
          this.interpretation = res.interpretation;
          this.loading = false;
        },
        error: err => {
          this.error = "Failed to interpret the report. Please try again.";
          this.loading = false;
        }
      });
  }
}
