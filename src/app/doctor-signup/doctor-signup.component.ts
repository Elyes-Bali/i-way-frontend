import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserRole } from '../models/user-role.enum'; 

@Component({
  selector: 'app-doctor-signup',
  templateUrl: './doctor-signup.component.html',
  styleUrls: ['./doctor-signup.component.css']
})
export class DoctorSignupComponent implements OnInit {
  signupForm: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      matricule: ['', Validators.required],

    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const signupData = {
        ...this.signupForm.value,
        userRole: UserRole.DOCTOR // Set role explicitly to DOCTOR
      };

      this.authService.register(signupData).subscribe({
        next: () => {
          this.snackBar.open('Doctor Registration successful', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.snackBar.open('Registration failed: ' + error.message, 'Close', {
            duration: 3000,
          });
        }
      });
    }
  }
}
