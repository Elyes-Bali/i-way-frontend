export interface MedicalFile {
    id?: number;
    doctorId: number;
    patientId: number;
    appointmentId: number;
    symptoms: string;
    prescriptions: string;
    additionalNotes?: string;
    reasons?: string;
    bloodType?: string;
    height?: string;
    weight?: string;
    previousMedication?:string;
    createdAt?: string;
    code?: string;
  }
  