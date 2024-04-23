import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../../features/login/services/login.service";
import {Router} from "@angular/router";
import {UserDetails} from "../../../features/login/models/user-details.model";
@Component({
  selector: 'ado-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit{
  username: string;
  role: object;
  isHR: boolean;
  isTeamLead: boolean;
  constructor(
    private loginService: LoginService,
    private router: Router) {}
    onLogout() {
      this.loginService.logout().subscribe();
    }
    ngOnInit(){
      this.loginService.currentUserDetails().subscribe((userDetails:UserDetails)=>{
        this.username = userDetails.username
        this.role = userDetails.roles

        this.isHR = userDetails.roles.includes('HR');
        this.isTeamLead = userDetails.roles.includes('TEAM_LEAD');

      });
    }
}
