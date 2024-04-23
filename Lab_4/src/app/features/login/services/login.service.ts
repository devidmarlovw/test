import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {LoginResponseData} from "../models/login.model";
import {UserDetails} from "../models/user-details.model";
import {BehaviorSubject, catchError, filter, Observable, switchMap, take, tap, throwError} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private _currentLoginDetails$: BehaviorSubject<LoginResponseData> = new BehaviorSubject<LoginResponseData>(
    null
  );
  private _currentUserDetails$: BehaviorSubject<UserDetails> = new BehaviorSubject<UserDetails>(
    null
  );

  constructor(private http: HttpClient, private router: Router) {
  }

  login(username: string, password: string): Observable<UserDetails> {
    const apiUrl = `${environment.apiUrl}/core/api/v1/login`;
    const body = {username, password};

    return this.http.post<LoginResponseData>(apiUrl, body).pipe(
      catchError(err => {
        console.error(err)
        return throwError(err)
      }),
      tap((resData: LoginResponseData) => {
        this._currentLoginDetails$.next(resData);
        localStorage.setItem('userData', JSON.stringify(resData));
      }),
      switchMap(() => {
        return this.getUserDetails()
      }), tap((userDetails) => {
        const userRole = userDetails.roles;
        // if role navigate to coresponding page
        if (userRole.includes('HR') || userRole.includes('TEAM_LEAD')) {
          this.router.navigate(['/requests']);
          return false;
        } else if (userRole.includes('USER')) {
          this.router.navigate(['/holidays'])
          return true;
        }
      })
    );
  }

  currentLoginDetailsValue(): LoginResponseData | null {
    return this._currentLoginDetails$.value;
  }

  currentUserDetails(): Observable<UserDetails> {
    return this._currentUserDetails$.asObservable().pipe(
      filter((userDetails) => {
        return !!userDetails
      })
    );
  }

  logout() {
    const refreshToken = this.currentLoginDetailsValue().refreshToken;
    const body = {refreshToken};

    return this.http.post(`${environment.apiUrl}/core/api/v1/logout`, body).pipe(
      catchError(err => {
        console.error(err)
        return throwError(err)
      }),
      tap(() => {
        this._currentLoginDetails$.next(null);
        localStorage.removeItem('userData')
        this.router.navigate(['/login'])
      })
    );
  }

  autoLogin() {
    const data = JSON.parse(localStorage.getItem('userData'))
    if (!data) {
      this.router.navigate(['/login'])
    } else {
      this._currentLoginDetails$.next(data);
      this.getUserDetails().pipe(take(1)).subscribe();
    }
  }

  getUserDetails() {
    return this.http.get<UserDetails>(`${environment.apiUrl}/core/api/v1/user`).pipe(
      tap((resData: UserDetails) => {
        this._currentUserDetails$.next(resData);
      })
    )
  }

  refresh(): Observable<LoginResponseData> {
    return this.http
      .post<LoginResponseData>(`${environment.apiUrl}/core/api/v1/refresh`, {
        refreshToken: this.currentLoginDetailsValue()
          ? this.currentLoginDetailsValue().refreshToken
          : null,
      })
      .pipe(
        tap(user => {
          this._currentLoginDetails$.next(user);
          localStorage.setItem('userData', JSON.stringify(user));
        }),
        catchError(error => {
          this._currentLoginDetails$.next(null);
          localStorage.removeItem('userData');
          this.router.navigate(['/login']);

          throw error;
        })
      );
  }
}
