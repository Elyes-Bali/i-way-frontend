import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { UserStorageService } from '../storage/user-storage.service';
import { User, UserDetails } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';
const BASIC_URL = `${environment.apiBaseUrl}/`;
@Injectable({
  providedIn: 'root',
})
export class AuthService {
 
  constructor(
    private http: HttpClient,
    private userStorageService: UserStorageService
  ) {}

  register(signupRequest: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(BASIC_URL + 'sign-up', signupRequest, { headers });
  }

  login(username: string, password: string): any {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { username, password };
    return this.http
      .post(BASIC_URL + 'authenticate', body, { headers, observe: 'response' })
      .pipe(
        map((res) => {
          const token = res.headers.get('authorization').substring(7);
          const user = res.body;
          if (token && user) {
            this.userStorageService.saveToken(token);
            this.userStorageService.saveUser(user);
            return true;
          }
          return false;
        })
      );
  }

  updateUser(
    userId: number,
    name?: string,
    email?: string,
    education?: string,
    experience?: string,
    statement?: string,
    skills?: string,
    address?: string,
    number?: number,
    eAddress?: string,
    speciality?: string,
    matricule?: string,
    verified?: boolean,  // Change from string to boolean
    image?: File,
    signature?: File,
    birthDate?: string
  ): Observable<any> {
    const formData = new FormData();
  
    if (name) formData.append('name', name);
    if (email) formData.append('email', email);
    if (education) formData.append('education', education);
    if (experience) formData.append('experience', experience);
    if (statement) formData.append('statement', statement);
    if (skills) formData.append('skills', skills);
    if (address) formData.append('address', address);
    if (number) formData.append('number', number.toString());
    if (eAddress) formData.append('eAddress', eAddress);
    if (speciality) formData.append('speciality', speciality);
    if (matricule) formData.append('matricule', matricule);
    if (verified !== undefined) formData.append('verified', verified.toString());  // Convert boolean to string here
    if (image) formData.append('image', image, image.name);
    if (signature) formData.append('signature', signature, signature.name);
    if (birthDate) formData.append('birthDate', birthDate.toString());
    return this.http.put<any>(`${BASIC_URL}update-user/${userId}`, formData);
  }
  

  getuserId(id: number): Observable<UserDetails> {
    return this.http.get<UserDetails>(`${BASIC_URL}get-user/${id}`);
  }

  getAllDoctors() {
    return this.http.get<UserDetails[]>(BASIC_URL + 'all-doctors');
  }

  getAllPatients() {
    return this.http.get<UserDetails[]>(BASIC_URL + 'all-patients');
  }

  getAllPharmacy() {
    return this.http.get<UserDetails[]>(BASIC_URL + 'all-pharmacies');
  }

  getAllUsers() {
    return this.http.get<UserDetails[]>(BASIC_URL + 'all-users');
  }
}
