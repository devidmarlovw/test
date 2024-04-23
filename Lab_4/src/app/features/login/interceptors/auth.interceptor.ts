import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import {LoginService} from "../services/login.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);

  constructor(private loginService: LoginService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<Object>> {
    let authReq = req;

    const loginDetails = this.loginService.currentLoginDetailsValue();

    if (loginDetails
      && typeof loginDetails.accessToken === 'string'
      && !['login', 'refresh', 'logout'].some(url => req.url.includes(url))) {

      authReq = this.addTokenHeader(authReq, loginDetails.accessToken)
    }

    return next.handle(authReq).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(authReq, next);
        }
        return throwError(error);
      })
    );
  }

  private handle401Error(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<Object>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const refreshToken = this.loginService.currentLoginDetailsValue().refreshToken;

      if (refreshToken) {
        return this.loginService.refresh().pipe(
          switchMap(response => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(response.accessToken);

            return next.handle(
              this.addTokenHeader(request, response.accessToken)
            );
          }),
          catchError(err => {
            this.isRefreshing = false;
            this.loginService.logout();

            return throwError(err);
          })
        );
      }
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(
    request: HttpRequest<unknown>,
    token: string | null
  ): HttpRequest<Object | unknown> {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });
  }
}
