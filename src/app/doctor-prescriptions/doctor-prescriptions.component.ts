import { Component, OnInit } from '@angular/core';
import { PrescriptionsService } from '../services/prescriptions/prescriptions.service';
import { UserStorageService } from '../services/storage/user-storage.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-doctor-prescriptions',
  templateUrl: './doctor-prescriptions.component.html',
  styleUrls: ['./doctor-prescriptions.component.css']
})
export class DoctorPrescriptionsComponent  implements OnInit {
  doctorId: number;
   patientId: number | null = null;
  prescriptions: any[] = [];

  constructor(
    private prescriptionService: PrescriptionsService,
    private userStorageService: UserStorageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.patientId = Number(this.route.snapshot.paramMap.get('patientId'));
    this.userStorageService.user$.subscribe(user => {
      if (user?.userId) {
        this.doctorId = user.userId;
        this.loadDoctorPrescriptions();
      }
    });
  }

loadDoctorPrescriptions(): void {
  this.prescriptionService.getPrescriptionsByDoctorId(this.doctorId).subscribe({
    next: (data) => {
      // Filter and reverse to show most recent first
      const filtered = this.patientId
        ? data.filter(p => p.patient?.id === this.patientId)
        : data;

      this.prescriptions = filtered.reverse();

      console.log(this.prescriptions);
    },
    error: (err) => {
      console.error('Error loading prescriptions', err);
    }
  });
}


  editPrescription(pres: any) {
  this.router.navigate(['/edit-prescription', pres.id]);
}

}
