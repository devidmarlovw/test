import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IndividualHolidaysRequestDto } from '../../../features/individual-holidays/models/holidays';
import { IndividualHolidaysUpdateRequest } from '../../../features/individual-holidays/models/requests';
import { environment } from '../../../../environments/environment';
import {ToastService} from "../toast.service";
import {IndividualHolidaysEditRequest} from "../../../features/individual-holidays/models/update-requests";

@Injectable({
  providedIn: 'root'
})
export class IndividualHolidaysRequestService {
  private individualHolidaysSubject: BehaviorSubject<IndividualHolidaysRequestDto[]> = new BehaviorSubject<IndividualHolidaysRequestDto[]>(null);

  constructor(private http: HttpClient,
              private toastService: ToastService) {}

  getIndividualHolidaysRequestBetweenDates(id: string): Observable<IndividualHolidaysRequestDto[]> {
    const url = `${environment.apiUrl}/core/api/v1/employees/${id}/requests`;

    return this.http.get<{ items: IndividualHolidaysRequestDto[] }>(url, ).pipe(
      map(res => res.items),
      tap(response => {
        this.individualHolidaysSubject.next(response);
      }),
      catchError((error) => {
        this.toastService.showError('Eroare la obtinerea datelor: concedii.');
        return of(null);
      })
    );
  }

  getRemainingHolidaysForCurrentUser(idUser: string): Observable<string> {
    const url = `${environment.apiUrl}/core/api/v1/employees/${idUser}/remaining-days-off`;
    return this.http.get<string>(url).pipe(
      catchError((error) => {
        this.toastService.showError('Eroare la obtinerea datelor: zile disponibile.');
        return of(null);
      })
    );
  }

  editIndividualHolidaysRequest(idUser: string, idRequest: string, newHolidaysRequest: IndividualHolidaysEditRequest): Observable<void> {
    const url = `${environment.apiUrl}/core/api/v1/employees/${idUser}/requests/${idRequest}`;
    return this.http.put<void>(url, newHolidaysRequest).pipe(
      catchError((error) => {
        this.toastService.showError('Eroare la editarea concediului.');
        return of(null);
      })
    );
  }

  addIndividualHolidaysRequest(idUser: string, holidaysRequest: IndividualHolidaysUpdateRequest): Observable<void> {
    const url = `${environment.apiUrl}/core/api/v1/employees/${idUser}/requests`;
    return this.http.post<void>(url, holidaysRequest).pipe(
      catchError((error) => {
        console.log(error.error)
        if (error.error.errorCode === 'EDOT0011400'){
          this.toastService.showError('Nu putem adauga o cerere de concediu pentru o perioada anterioara.')
        }
        if (error.error.errorCode === 'EDOT0009400'){
          this.toastService.showError('Eroare la adaugarea concediului: Zile disponibile insuficiente.');
        }
        return of(null);
      })
    );
  }

  deleteIndividualHolidaysRequest(idUser: string, requestId: string, employeeId: string): Observable<void> {
    const url = `${environment.apiUrl}/core/api/v1/employees/${employeeId}/requests/${requestId}`;

    return this.http.delete<void>(url).pipe(
      catchError((error) => {
        this.toastService.showError('Eroare la stergerea concediului.');
        return of(null);
      })
    );
  }

  getIndividualHolidaysRequestById(
    requestId: string
  ): IndividualHolidaysRequestDto | undefined {
    return this.individualHolidaysSubject.value
      ? this.individualHolidaysSubject.value.find(
        request => Number(request.id) === Number(requestId)) : undefined;
  }
}
