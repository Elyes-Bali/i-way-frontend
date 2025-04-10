import { Component } from '@angular/core';
import { Form, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserStorageService } from '../services/storage/user-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: any;
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar:MatSnackBar
  ) { }

  ngOnInit (): void {
    this.loginForm = this.formBuilder.group({
      email: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    const username = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;
  
    this.authService.login(username, password).subscribe(
      (res) => {
        if (UserStorageService.isAdminLoggedIn()) {
          this.router.navigate(['/charts']);
        } else if (UserStorageService.isPatientLoggedIn()) {
          this.router.navigate(['/']);
        } else if (UserStorageService.isDoctorLoggedIn()) {
          this.router.navigate(['/']);
        }else if (UserStorageService.isPharmacyLoggedIn()) {
          this.router.navigate(['/pharmacy/prescription']);
        }
      },
      (error) => {
        if (error.status === 403) {
          this.snackBar.open('Your account is not verified. Please wait for approval.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        } else {
          this.snackBar.open('Login failed: Check Credentials', 'Close', {
            duration: 3000,
          });
        }
      }
    );
  }
  

}
