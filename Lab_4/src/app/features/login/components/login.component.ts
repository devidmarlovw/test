import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../services/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'ado-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(private loginService: LoginService) { }
  ngOnInit(): void {
    this.loginForm = new FormGroup<any>({
      'username': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required)
    });
  }
  onSubmit(){
    //Get value from input
    const credentials = {
      username: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value,
    }
    this.loginService.login(credentials.username, credentials.password).subscribe(
      (response) => {
        console.log('Login Success', response)
      },
      (error) => {
        console.error('Login Failed error', error);
      }
    )
  }
}
