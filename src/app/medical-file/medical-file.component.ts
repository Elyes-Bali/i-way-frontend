import { Component, OnInit } from '@angular/core';
import { MedicalFile } from '../models/medical-file.model';
import { ActivatedRoute } from '@angular/router';
import { MedicalFileService } from '../services/medicalFile/medical-file.service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-medical-file',
  templateUrl: './medical-file.component.html',
  styleUrls: ['./medical-file.component.css']
})
export class MedicalFileComponent implements OnInit{
  patientId:number;
  doctorId:number;
  medicalFile: MedicalFile = {
    doctorId: 0,
    patientId: 0,
    appointmentId: 0,
    symptoms: '',
    prescriptions: '',
    additionalNotes: '',
    reasons: '',
    bloodType: '',
    height: '',
    weight: '',
    previousMedication:"No Previous Medications"
  };
  allMedicalFiles: any[] = [];
  testMedicalFiles: MedicalFile[] = [];
  predictedDisease: string = '';
  symptomsInput$: Subject<string> = new Subject<string>();
  constructor(private route: ActivatedRoute, private medicalFileService: MedicalFileService,private http: HttpClient) {}

  ngOnInit() {
    this.medicalFile.doctorId = Number(this.route.snapshot.paramMap.get('doctorId'));
    this.medicalFile.patientId = Number(this.route.snapshot.paramMap.get('patientId'));
    this.medicalFile.appointmentId = Number(this.route.snapshot.paramMap.get('appointmentId'));
    this.patientId=Number(this.route.snapshot.paramMap.get('patientId'));
    this.doctorId=Number(this.route.snapshot.paramMap.get('doctorId'));
    this.loadMedicalFiles();

     this.symptomsInput$.pipe(debounceTime(1000)).subscribe(symptoms => {
    if (symptoms.trim().length > 3) {
      this.predictDisease(symptoms);
    } else {
      this.predictedDisease = '';
    }
  });
  }

  loadMedicalFiles(): void {
    this.medicalFileService.getMedicalFiles().subscribe((allMedicalFiles) => {
      this.allMedicalFiles = allMedicalFiles
      console.log(this.allMedicalFiles)
      this.filterMedicalFileForPatient();
    })}

    filterMedicalFileForPatient(): void {
      // Find the medical file of the patient based on patientId
      const patientMedicalFile = this.allMedicalFiles.find(file => file.patient.id === this.patientId && file.doctor.id===this.doctorId);
      if (patientMedicalFile) {
        this.medicalFile = patientMedicalFile;
        this.testMedicalFiles = patientMedicalFile;
        console.log("medical file",this.testMedicalFiles)
      }
    }
    saveMedicalFile() {
      // Check if required fields are filled
      if (!this.medicalFile.reasons || !this.medicalFile.symptoms || !this.medicalFile.prescriptions) {
        alert('Please fill in both the Purpose of the Visit , Symptoms and Prescriptions fields before saving.');
        return; // Stop execution if fields are empty
      }
    
      // Proceed with saving if fields are valid
      this.medicalFileService.createMedicalFile(
        this.medicalFile.doctorId,
        this.medicalFile.patientId,
        this.medicalFile
      ).subscribe(response => {
        alert('Medical file saved successfully!');
      });
    }
    

  updateMedicalFile(): void {
    this.medicalFileService.updateMedicalFile(this.medicalFile.id, this.medicalFile).subscribe(
      response => {
        alert('Medical file updated successfully!');
      },
      error => {
        alert('Error updating medical file');
      }
    );
  }

  //  predictDisease() {
  //   if (!this.medicalFile.symptoms || this.medicalFile.symptoms.trim().length === 0) {
  //     alert("Please enter symptoms first.");
  //     return;
  //   }

  //   this.http.post<{ prediction: string }>('http://localhost:5000/predict-disease', {
  //     symptoms: this.medicalFile.symptoms
  //   }).subscribe({
  //     next: (res) => this.predictedDisease = res.prediction,
  //     error: (err) => {
  //       console.error("Prediction failed:", err);
  //       this.predictedDisease = "Prediction failed. Try again.";
  //     }
  //   });
  // }

  predictDisease(symptoms: string) {
  this.http.post<{ prediction: string }>('http://localhost:5000/predict-disease', {
    symptoms: symptoms
  }).subscribe({
    next: (res) => this.predictedDisease = res.prediction,
    error: (err) => {
      console.error("Prediction failed:", err);
      this.predictedDisease = "Prediction failed. Try again.";
    }
  });
}

  
}
