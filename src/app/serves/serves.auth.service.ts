import { from } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url:'http://localhost:3000';
  constructor(private http: HttpClient ) { }
 
  AddUser(values){
   return this.http.post('http://localhost:3000/auth/signUp',values);
  };
}
