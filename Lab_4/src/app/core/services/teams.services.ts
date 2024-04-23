import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { TeamDTO } from "../../shared/models/team-dto";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private apiUrl = `${environment.apiUrl}/core/api/v1/teams`;

  constructor(private http: HttpClient) {}

  public getTeams(): Observable<TeamDTO[]> {
    return this.http.get<{ items: TeamDTO[] }>(this.apiUrl).pipe(
      catchError((error) => {
        const errorMessage = 'Error. Failed fetching teams.';
        return throwError(errorMessage);
      }),
      map((response: { items: TeamDTO[] }) => response.items)
    );
  }
}
