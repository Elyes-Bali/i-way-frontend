export interface MedicationDto {
  name: string;
  usage: string;
  duration: string;
  delivered: boolean;
}

export interface PrescriptionDto {
  doctorId: number;
  patientId: number;
  symptoms: string;
  medications: MedicationDto[];
  createdAt?: string;
  code?: string;
  status?: boolean; // true if all medications are delivered, false otherwise
}