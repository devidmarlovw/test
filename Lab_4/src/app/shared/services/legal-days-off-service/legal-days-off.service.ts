import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { LegalDaysOffDTO} from "../../models/legal-days-off-dto";
import { environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class LegalDaysOffService {
  private legallyDaysOffCache: Map<number, LegalDaysOffDTO[]> = new Map();
  private legallyDaysOffSubject: BehaviorSubject<LegalDaysOffDTO[]>;

  constructor(private http: HttpClient) {
    this.legallyDaysOffSubject = new BehaviorSubject([]);
  }

  getLegalDaysOffByYear(year: number): Observable<LegalDaysOffDTO[]> {
    if (this.legallyDaysOffCache.has(year)) {
      return this.legallyDaysOffSubject.asObservable();
    }

    const url = `${environment.apiUrl}/core/api/v1/misc/legally-days-off`;
    const params = new HttpParams().set('years', year.toString());
    this.http
      .get<LegalDaysOffDTO[]>(url, { params })
      .subscribe((data) => {
        this.legallyDaysOffCache.set(year, data);
        this.legallyDaysOffSubject.next(data);
      });

    return this.legallyDaysOffSubject.asObservable();
  }
}

