import { User } from './user.model';

export interface Appointment {
  id?: number;
  doctorId: number;
  patientId: number;
  date: string;
  time: string;
  accepted?: boolean; 
  status: AppointmentStatus;
  patient?: User;
  doctor?: User;
  fullDate?:string;
}

export interface BookingResponse {
  status: string;
  message: string;
}


export enum AppointmentStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}
