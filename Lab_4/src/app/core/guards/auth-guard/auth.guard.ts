import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree, CanActivateChild } from '@angular/router';
import { Observable, take, map } from 'rxjs';
import { LoginService } from 'src/app/features/login/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.loginService.currentUserDetails().pipe(
      take(1),
      map(user => {
        if (!user) {
          this.router.navigate(['/login']);
        }

        const roles = route.data['roles'] as Array<string>;
        let redirect = true;
        user.roles.forEach(role => {
          if (roles.indexOf(role) !== -1) {
            redirect = false;
          }
        });

        if (redirect) {
          user.roles.forEach(role => {
            if (role === 'HR' || role === 'TEAM_LEAD') {
              this.router.navigate(['/requests']);
              return false;
            } else if (role === 'USER') {
              this.router.navigate(['/holidays']);
              return false;
            }
          });
        }

        return true;
      })
    );
  }
}
