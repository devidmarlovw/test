import { Component } from '@angular/core';
import {LoginService} from "./features/login/services/login.service";

@Component({
  template: `
    <router-outlet></router-outlet>`,
  selector: 'ado-root',
})

export class AppComponent {
constructor(private loginService:LoginService) {
  this.loginService.autoLogin()
}
}
