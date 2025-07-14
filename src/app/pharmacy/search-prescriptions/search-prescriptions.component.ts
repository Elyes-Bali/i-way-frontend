import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MedicalFileService } from 'src/app/services/medicalFile/medical-file.service';
import { PrescriptionsService } from 'src/app/services/prescriptions/prescriptions.service';
import { UserStorageService } from 'src/app/services/storage/user-storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-search-prescriptions',
  templateUrl: './search-prescriptions.component.html',
  styleUrls: ['./search-prescriptions.component.css'],
})
export class SearchPrescriptionsComponent implements OnInit {
  searchCode: string = ''; // Bind the search input to this variable
  currentIndex: number = 0;
  markedUnavailable: boolean = false;
  Allprescriptions: any[] = [];
  filteredPrescriptions: any[] = [];
  medicationName: string = '';
  alternatives: string | null = null;
  loading: boolean = false;
  constructor(
    private prescriptionService: PrescriptionsService,
    private http: HttpClient
  ) {}

  ngOnInit() {}

  filterPrescriptions(): void {
    if (this.searchCode) {
      // Load the files only when the user starts typing
      if (this.Allprescriptions.length === 0) {
        this.prescriptionService.getAllPrescriptions().subscribe(
          (data) => {
            this.Allprescriptions = data; // Fetch files only once
            console.log(this.Allprescriptions);
            // Filter only the files that match the entered code
            this.filteredPrescriptions = this.Allprescriptions.filter(
              (file) =>
                file.code.toLowerCase() === this.searchCode.toLowerCase()
            );
          },
          (error) => {
            console.error('Error fetching Prescriptions:', error);
          }
        );
      } else {
        // If files are already loaded, just filter them
        this.filteredPrescriptions = this.Allprescriptions.filter(
          (file) => file.code.toLowerCase() === this.searchCode.toLowerCase()
        );
      }
    } else {
      // If no code is typed, clear the filtered results
      this.filteredPrescriptions = [];
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const yy = date.getFullYear().toString().slice(-4);
    const dd = date.getDate().toString().padStart(2, '0');
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${yy}/${dd}/${mm}`;
  }

  getFormattedContent(content: string): string {
    // Convert newlines to <br> and preserve spaces using <pre> tag
    return content.replace(/\n/g, '<br>').replace(/  /g, '&nbsp;&nbsp;');
  }

  toggleDelivered(index: number): void {
    const prescription = this.filteredPrescriptions[this.currentIndex];
    prescription.medications[index].delivered =
      !prescription.medications[index].delivered;

    this.prescriptionService
      .updatePrescription(prescription.id, {
        doctorId: prescription.doctor.id,
        patientId: prescription.patient.id,
        symptoms: prescription.symptoms,
        medications: prescription.medications.map((m: any) => ({
          name: m.name,
          usage: m.usageInstructions,
          duration: m.duration,
          delivered: m.delivered,
        })),
        status: prescription.status, // ✅ preserve existing status
      })
      .subscribe({
        next: () => console.log('Prescription updated'),
        error: (err) => console.error('Failed to update prescription', err),
      });
  }


  markAsUnavailable(): void {
    const prescription = this.filteredPrescriptions[this.currentIndex];
    prescription.status = false;

    this.prescriptionService
      .updatePrescription(prescription.id, {
        doctorId: prescription.doctor.id,
        patientId: prescription.patient.id,
        symptoms: prescription.symptoms,
        medications: prescription.medications.map((m: any) => ({
          name: m.name,
          usage: m.usageInstructions,
          duration: m.duration,
          delivered: m.delivered,
        })),
        status: false, // 👈 make sure status is passed
      })
      .subscribe({
        next: () => {
          console.log('Marked as unavailable');
          this.markedUnavailable = true; // ✅ show notification
        },
        error: (err) => console.error('Update failed', err),
      });
  }

  setCurrentIndex(index: number): void {
    this.currentIndex = index;
    this.markedUnavailable = false; // reset on switch
  }


 fetchAlternatives() {
    if (!this.medicationName.trim()) return;
 this.loading = true;
    // Directly call the backend API URL here
    const apiUrl = `${environment.apiAiUrl}/get-alternatives`; // Adjust URL if needed

    this.http.post<{ alternatives: string }>(apiUrl, { medication: this.medicationName }).subscribe({
      next: (res) => {
        this.alternatives = res.alternatives;
        this.loading = false; // Stop loading after response
      },
      error: (err) => {
        console.error("Failed to fetch alternatives", err);
        this.loading = false; 
      },
    });
  }
}
