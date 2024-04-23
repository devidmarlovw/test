import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  AddedEmployeeDTO,
  EmployeeDTO,
  UpdatedEmployeeDTO,
} from '../../shared/models/employees';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private http: HttpClient) {}

  public getEmployees(teamId?: string): Observable<EmployeeDTO[]> {
    let params = new HttpParams();
    if (teamId) {
      params = params.append('teamId', teamId);
      return this.http
        .get<{ items: EmployeeDTO[] }>(
          `${environment.apiUrl}/core/api/v1/employees`,
          { params: params }
        )
        .pipe(map(response => response.items));
    } else {
      return this.http
        .get<{ items: EmployeeDTO[] }>(
          `${environment.apiUrl}/core/api/v1/employees`
        )
        .pipe(map(response => response.items));
    }
  }

  addEmployee(employee: AddedEmployeeDTO): Observable<EmployeeDTO> {
    return this.http
      .post< EmployeeDTO >(
        `${environment.apiUrl}/core/api/v1/employees`,
        employee
      )
  }

  updateEmployee(
    id: string | undefined,
    employee: UpdatedEmployeeDTO
  ): Observable<EmployeeDTO> {
    return this.http.patch<EmployeeDTO>(
      `${environment.apiUrl}/core/api/v1/employees/${id}`,
      employee
    );
  }

  inactivateEmployee(id: string) {

      return this.http.patch<EmployeeDTO[]>(
        `${environment.apiUrl}/core/api/v1/employees/${id}/inactivate`, {});

    }

  }

