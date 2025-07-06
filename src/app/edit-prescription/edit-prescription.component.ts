import { Component, OnInit } from '@angular/core';
import { PrescriptionDto } from '../models/prescription.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PrescriptionsService } from '../services/prescriptions/prescriptions.service';

@Component({
  selector: 'app-edit-prescription',
  templateUrl: './edit-prescription.component.html',
  styleUrls: ['./edit-prescription.component.css']
})
export class EditPrescriptionComponent  implements OnInit {
  prescriptionId: number;
  prescription: PrescriptionDto = {
    symptoms: '',
    doctorId: 0,
    patientId: 0,
    medications: []
  };

  constructor(
    private route: ActivatedRoute,
    private prescriptionService: PrescriptionsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.prescriptionId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPrescription();
  }

  loadPrescription(): void {
    this.prescriptionService.getPrescriptionById(this.prescriptionId).subscribe({
      next: (data) => {
        this.prescription = {
          symptoms: data.symptoms,
          doctorId: data.doctor.id,
          patientId: data.patient.id,
          medications: data.medications.map((m: any) => ({
            name: m.name,
            usage: m.usageInstructions,
            duration: m.duration,
            delivered: m.delivered
          }))
        };
      },
      error: (err) => console.error('Failed to load prescription', err)
    });
  }

  addMedication(): void {
    this.prescription.medications.push({
      name: '',
      usage: '',
      duration: '',
      delivered: false
    });
  }

  removeMedication(index: number): void {
    this.prescription.medications.splice(index, 1);
  }

  updatePrescription(): void {
    this.prescription.status = true;
    this.prescriptionService.updatePrescription(this.prescriptionId, this.prescription).subscribe({
      next: () => {
        alert('Prescription updated successfully!');
        this.router.navigate(['/my-prescriptions', this.prescription.patientId]);
      },
      error: (err) => {
        console.error('Update failed:', err);
        alert('Update failed. Check the console for more info.');
      }
    });
  }
}