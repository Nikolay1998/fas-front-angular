import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {BalanceChange} from "../_models/balance-change";

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
  ) { }

  getSummary(): Observable<Map<string, number>> {
    return this.http.get<Map<string, number>>(`${environment.apiUrl}/summary/sum`, this.httpOptions);
  }

  getBalanceChange(from: Date, to: Date): Observable<BalanceChange[]> {
    console.log(from);
    console.log(to);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      params: new HttpParams().set('from', from.toString()).set('to', to.toString())
    };
    return this.http.get<BalanceChange[]>(`${environment.apiUrl}/summary/balance-change`, httpOptions);
  }
}
