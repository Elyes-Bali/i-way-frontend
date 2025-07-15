import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DoctorAvailability } from 'src/app/models/doctor-availability.model';
import { environment } from 'src/environments/environment';

const API_URL = `${environment.apiBaseUrl}/availability/`;
@Injectable({
  providedIn: 'root'
})
export class DoctorAvailabilityService {
  readonly APP_API_URL = `${environment.apiBaseUrl}/availability/`;
  constructor(private http: HttpClient) {}

  addAvailability(availabilities: DoctorAvailability[], headers: HttpHeaders, doctorId: number): Observable<any> {
    const url = `${API_URL}set?doctorId=${doctorId}`;
    return this.http.post(url, availabilities, { headers, responseType: 'text' as 'json' });
  }
  
  

  getDoctorAvailability(doctorId: number): Observable<DoctorAvailability[]> {
    return this.http.get<DoctorAvailability[]>(`${API_URL}get/${doctorId}`);
  }
  // getAllDoctorAvailabilities(): Observable<any[]> {
  //   return this.http.get<any[]>(`http://localhost:8080/availability/doctors`);
  // }
  getAllDoctorAvailabilities(): Observable<any[]> {
  return this.http.get<any[]>(`${API_URL}doctors`);
}


  deleteAvailabilitie(id: number): Observable<void> {
    const url = `${this. APP_API_URL}deletapp/${id}`;
    return this.http.delete<void>(url);
  }

}
