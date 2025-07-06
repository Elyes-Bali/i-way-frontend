import { Component, OnInit } from '@angular/core';
import { MedicationDto, PrescriptionDto } from '../models/prescription.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PrescriptionsService } from '../services/prescriptions/prescriptions.service';

@Component({
  selector: 'app-add-prescription',
  templateUrl: './add-prescription.component.html',
  styleUrls: ['./add-prescription.component.css']
})
export class AddPrescriptionComponent implements OnInit {
  patientId: number;
  doctorId: number;
  symptoms: string = '';
  medications: MedicationDto[] = [];

  constructor(
    private route: ActivatedRoute,
    private prescriptionService: PrescriptionsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.patientId = Number(this.route.snapshot.paramMap.get('patientId'));
    this.doctorId = Number(this.route.snapshot.paramMap.get('doctorId'));
    this.addMedication(); // Add initial empty medication row
  }

  addMedication(): void {
    this.medications.push({ name: '', usage: '', duration: '', delivered: false });
  }

  removeMedication(index: number): void {
    this.medications.splice(index, 1);
  }

  submitPrescription(): void {
    const prescription: PrescriptionDto = {
      doctorId: this.doctorId,
      patientId: this.patientId,
      symptoms: this.symptoms,
      medications: this.medications
    };

    this.prescriptionService.addPrescription(prescription).subscribe({
      next: () => {
        alert('Prescription added successfully');
        this.router.navigate(['/mypatients']);
      },
      error: (err) => {
        console.error('Error adding prescription', err);
        alert('Failed to add prescription');
      }
    });
  }
}