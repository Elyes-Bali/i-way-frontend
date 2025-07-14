import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reclamations } from 'src/app/models/ReclamationsM';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReclamationsService {
  readonly RECLAMATION_API_URL = `${environment.apiBaseUrl}/reclamations/`;
  constructor(private httpclient: HttpClient) {}

  getAllReclamations() {
    return this.httpclient.get<Reclamations[]>(
      this.RECLAMATION_API_URL + 'getallrecs'
    );
  }

  editReclamation(id: number, reclamation: Reclamations) {
    const url =
      this.RECLAMATION_API_URL + 'updaterec/' + reclamation.idReclamation; 
    return this.httpclient.put(url, reclamation);
  }
  deleteReclamation(id: number): Observable<void> {
    const url = `${this.RECLAMATION_API_URL}deleterec/${id}`;
    return this.httpclient.delete<void>(url);
  }

  getReclamationId(id: number): Observable<Reclamations> {
    return this.httpclient.get<Reclamations>(
      `${this.RECLAMATION_API_URL}getrecbyid/${id}`
    );
  }
}
