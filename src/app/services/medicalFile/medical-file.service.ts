import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MedicalFile } from 'src/app/models/medical-file.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedicalFileService {
  private apiUrl = `${environment.apiBaseUrl}/medical`;

  constructor(private http: HttpClient) {}

  getMedicalFilesForDoctor(doctorId: number): Observable<MedicalFile[]> {
    return this.http.get<MedicalFile[]>(`${this.apiUrl}/doctor/${doctorId}`);
  }

  getMedicalFilesForPatient(patientId: number): Observable<MedicalFile[]> {
    return this.http.get<MedicalFile[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  createMedicalFile(doctorId: number, patientId: number, medicalFile: MedicalFile): Observable<MedicalFile> {
    if (!doctorId || !patientId ) {
      throw new Error("Doctor ID, Patient ID, and Appointment ID must be provided.");
    }
  
    // Modify the URL to include appointmentId
    return this.http.post<MedicalFile>(`${this.apiUrl}/create/${doctorId}/${patientId}`, medicalFile);
  }
  
  getMedicalFiles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+"/allfiles");
  }

  updateMedicalFile(medicalFileId: number, medicalFile: MedicalFile): Observable<MedicalFile> {
    return this.http.put<MedicalFile>(`${this.apiUrl}/update/${medicalFileId}`, medicalFile);
  }
  
}
