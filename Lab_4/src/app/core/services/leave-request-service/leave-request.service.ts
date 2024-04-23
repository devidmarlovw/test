import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Observable, map, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LeaveRequestDTO } from '../../../shared/models/leave-request/leave-request-dto';
import { LeaveRequestFilter, StatusFilter, TypeFilter } from '../../../shared/models/leave-request/leave-request-filter';
import { environment } from '../../../../environments/environment';
import { REQUESTS } from '../../../../fake-backend/data-requests';

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {
  public requests$: Observable<LeaveRequestDTO[]>;
  private baseUrl = `${environment.apiUrl}/core/api/v1`;

  constructor(private http: HttpClient) { }

  loadLeaveRequests(filters?: LeaveRequestFilter): Observable<LeaveRequestDTO[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.status !== StatusFilter.ALL) {
        params = params.append('status', filters.status);
      }
      if (filters.type !== TypeFilter.ALL) {
        params = params.append('type', filters.type);
      }
      if (filters.startDate) {
        params = params.append('startDate', filters.startDate);
      }
      if (filters.endDate) {
        params = params.append('endDate', filters.endDate);
      }
      if (filters.search) {
        params = params.append('search', filters.search);
      }
    }

    return this.http.get<{ items: LeaveRequestDTO[] }>(`${this.baseUrl}/requests`, { params })
      .pipe(
        map(response => response.items),
        catchError(error => this.handleError(error))
      );
  }

  acceptRequest(requestId: string, employeeId: string, v: number): Observable<LeaveRequestDTO> {
    const url = `${this.baseUrl}/employees/${employeeId}/requests/${requestId}`;
    const body = {
      type: 'APPROVAL',
      v: v
    };
    return this.http.patch<LeaveRequestDTO>(url, body).pipe(
      catchError(error => this.handleError(error))
    );
  }

  refuseRequest(requestId: string, employeeId: string, v: number, rejectionReason: string): Observable<LeaveRequestDTO> {
    const url = `${this.baseUrl}/employees/${employeeId}/requests/${requestId}`;
    const body = {
      type: 'REJECTION',
      v: v,
      rejectionReason: rejectionReason
    };
    return this.http.patch<LeaveRequestDTO>(url, body).pipe(
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error): Observable<never> {
    console.error('error:', error);
    return throwError('Ceva s-a întâmplat, revenim.');
  }

  getLeaveRequest() {
    return [];
  }
}
