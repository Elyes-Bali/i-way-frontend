import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { UserStorageService } from '../services/storage/user-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
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
