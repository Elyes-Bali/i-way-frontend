import { UserRole } from "./user-role.enum";

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

export class UserDto {
    id: number;
    email: string;
    name: string;
    userRole: UserRole;  
    imgUrl?: string;   
  }

export class UserDetails {
    id: number;
    email: string;
    name: string;
    role: UserRole;  
    imgUrl?: string;  
    education: string; 
    experience: string; 
    statement: string; 
    skills: string; 
    adress: string; 
    number: number; 
    eaddress: string;
    speciality: string; 
    matricule:string;
    verified:boolean;
    signatureUrl?:string;
    birthDate?:string ;
  }

  
