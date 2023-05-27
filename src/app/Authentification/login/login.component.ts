import { Component, OnInit } from '@angular/core';

import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { LocalStorageService } from 'src/app/services/local-storage.service';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {


  
  password: string='';
  username: string='';
  registerForm!: FormGroup;
  submitted = false;
  user: User = new User('','');


  constructor(private userservice: AuthService,private formBuilder: FormBuilder,private route:Router,private localStorageService: LocalStorageService) {
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({

      username: [, [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      password: [, [Validators.required, Validators.minLength(6)]],
    })
  }
  // pour acceder aux champs des formulaires
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stopper si le formulaire est invalide
    if (this.registerForm.invalid) {
      return;
    }
    else{
      this.login();

    }
  }

  login() {


    this.userservice.login(this.user.username, this.user.password).subscribe(data => {
       if (data != null) {

        this.localStorageService.setItem("user_connecte", JSON.stringify(data));
        alert("connexion réussite");
        this.route.navigate(["/"])
      }

      //Probleme de connexion
      else {

        this.userservice.doesUserExist(this.user.username).subscribe(
          message => {
            if (message) {
              alert("mot de passe incorrect")
            } else {
              alert("utilisateur inexistant")
            }

          })
      }
    })

  }



  //Si on annulle l inscription on va vider les champs
  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }

}

