import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment, BookingResponse } from 'src/app/models/appointment.model';
import { environment } from 'src/environments/environment';

const API_URL = `${environment.apiBaseUrl}/appointments`;
@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  constructor(private http: HttpClient) {}

  bookAppointment(appointment: Appointment): Observable<BookingResponse> {
    const doctorId = appointment.doctorId;
    const patientId = appointment.patientId;
    
    // Send doctorId, patientId as query parameters, and the appointment data in the request body
    return this.http.post<BookingResponse>(`${API_URL}/book?doctorId=${doctorId}&patientId=${patientId}`, appointment);
  }
  

  getAppointmentsForDoctor(doctorId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${API_URL}/doctor/${doctorId}`);
  }

  getAppointmentsForPatient(patientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${API_URL}/patient/${patientId}`);
  }

  updateAppointmentStatus(appointmentId: number, status: string): Observable<any> {
    return this.http.put(`${API_URL}/app/${appointmentId}/status?status=${status}`, {});
  }

  acceptAppointment(appointmentId: number): Observable<any> {
    return this.updateAppointmentStatus(appointmentId, 'ACCEPTED');
  }

  rejectAppointment(appointmentId: number): Observable<any> {
    return this.updateAppointmentStatus(appointmentId, 'REJECTED');
  }

  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${API_URL}/all`);
  }
  
  cancelAppointment(appointmentId: number): Observable<any> {
    return this.http.put(`${API_URL}/canceled/${appointmentId}/cancel`, {});
  }
  
}
