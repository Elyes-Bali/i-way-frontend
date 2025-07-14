import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PrescriptionDto } from 'src/app/models/prescription.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionsService {
 private baseUrl = `${environment.apiBaseUrl}/prescriptions`;

  constructor(private http: HttpClient) {}

  addPrescription(prescription: PrescriptionDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, prescription);
  }

  getAllPrescriptions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  getPrescriptionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getby/${id}`);
  }
  getPrescriptionsByDoctorId(doctorId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/doctor/${doctorId}`);
}
 getPrescriptionsByPatientId(patientId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/patient/${patientId}`);
}

updatePrescription(id: number, prescription: PrescriptionDto): Observable<any> {
  return this.http.put(`${this.baseUrl}/update/${id}`, prescription);
}

getAlternatives(medication: string) {
  return this.http.post<{ alternatives: string }>("/get-alternatives", {
    medication,
  });
}

}
