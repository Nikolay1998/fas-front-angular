import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiUrlHolder} from "./api-url-holder";
import {PeriodStats} from "../_models/period-stats";

@Injectable({
  providedIn: 'root'
})
export class SummaryService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private http: HttpClient,
    private apiUrlHolder: ApiUrlHolder
  ) { }

  getSummary(): Observable<Map<string, number>> {
    return this.http.get<Map<string, number>>(`${this.apiUrlHolder.getApiUrl()}summary/sum`, this.httpOptions);
  }

  getPeriodStats(from: Date, to: Date): Observable<PeriodStats> {
    console.log(from);
    console.log(to);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      params: new HttpParams().set('from', from.toString()).set('to', to.toString())
    };
    return this.http.get<PeriodStats>(`${this.apiUrlHolder.getApiUrl()}summary/period-stats`, httpOptions);
  }
}
