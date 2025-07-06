import { Component, OnInit } from '@angular/core';
import { UserStorageService } from '../services/storage/user-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  isPatientLoggedIn : boolean = UserStorageService.isPatientLoggedIn();
  isDoctorLoggedIn : boolean = UserStorageService.isDoctorLoggedIn();
  isPharmacyLoggedIn : boolean = UserStorageService.isPharmacyLoggedIn();

  constructor(private router : Router) { }

  ngOnInit() {


    this.router.events.subscribe(event => {
      this.isPatientLoggedIn = UserStorageService.isPatientLoggedIn();
      this.isDoctorLoggedIn = UserStorageService.isDoctorLoggedIn();
      this.isPharmacyLoggedIn = UserStorageService.isPharmacyLoggedIn();
    })
  }

}