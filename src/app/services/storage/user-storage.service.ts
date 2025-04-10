import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const TOKEN = "med-token";
const USER = "med-user";

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(this.loadUser()); // Track user in memory
  public user$ = this.userSubject.asObservable(); // Observable to subscribe to

  constructor() {}

  // Load user from localStorage
  private loadUser() {
    return JSON.parse(localStorage.getItem(USER)) || null;
  }

  public saveToken(token: string): void {
    window.localStorage.setItem(TOKEN, token);
  }

  public saveUser(user: Object): void {
    window.localStorage.setItem(USER, JSON.stringify(user));
    this.userSubject.next(user); // Emit the new user data
    console.log("User saved and updated:", user);
  }

  static getToken(): string {
    return localStorage.getItem(TOKEN);
  }

  // Use BehaviorSubject's value for the latest user
  static getUser(): any {
    const user = JSON.parse(localStorage.getItem(USER));
    return user || null;
  }

  static getUserId(): string {
    const user = this.getUser();
    if (user == null) {
      return '';
    }
    return user.userId;
  }

  static getUserRole(): string {
    const user = this.getUser();
    if (user == null) {
      return '';
    }
    return user.role;
  }

  static isAdminLoggedIn(): boolean {
    if (this.getToken() === null) {
      return false;
    }
    const role: string = this.getUserRole();
    return role === 'ADMIN';
  }

  static isPatientLoggedIn(): boolean {
    if (this.getToken() === null) {
      return false;
    }
    const role: string = this.getUserRole();
    return role === 'PATIENT';
  }

  static isDoctorLoggedIn(): boolean {
    if (this.getToken() === null) {
      return false;
    }
    const role: string = this.getUserRole();
    return role === 'DOCTOR';
  }

  static isPharmacyLoggedIn(): boolean {
    if (this.getToken() === null) {
      return false;
    }
    const role: string = this.getUserRole();
    return role === 'PHARMACY';
  }

  static signOut(): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);
  }
}
