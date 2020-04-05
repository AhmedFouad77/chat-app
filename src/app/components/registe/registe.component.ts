import { Component, OnInit, Output } from '@angular/core';
import {FormGroup  , FormBuilder , Validators  } from '@angular/forms';
import { AuthService } from '../../serves/serves.auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-registe',
  templateUrl: './registe.component.html',
  styleUrls: ['./registe.component.css']
})
export class RegisteComponent implements OnInit {
  registerForm : FormGroup;
 
  constructor(private fb :FormBuilder , private server : AuthService , private router : ActivatedRoute) { 
    this.ValidationForm();
  };
   msg ;

  ValidationForm(){
  this.registerForm = this.fb.group({

    firstName : ['',Validators.compose([
                    Validators.required,
                    Validators.minLength(5)
                     ])],

    lastName  : ['',Validators.compose([
                Validators.required,
                Validators.minLength(5)
                ])],

      email :['',Validators.compose([
        Validators.required,
        // Validators.minLength(5),
        Validators.email
      ])],

      password :['',Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])],

      confirmPassword :['',Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),

])]
    })
  };

 async AddUser(formValues){
  this.server.AddUser(formValues).subscribe(res=>{
  this.msg = res;
  })

  }
  ngOnInit(): void {
  }
  
}