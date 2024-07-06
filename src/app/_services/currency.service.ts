import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Currency } from '../_models/currency';


@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private emptyNodes: Currency[] = []
  private summarySource = new BehaviorSubject(this.emptyNodes);
  currentNodes = this.summarySource.asObservable();


  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'responseType': 'text'
    })
  };


  constructor(
    private http: HttpClient
  ) { }

  updateCurrency() {
    this.getCurrencys().subscribe(cur => this.summarySource.next(cur))
  }

  private getCurrencys(): Observable<Currency[]> {
    return this.http.get<Currency[]>(`${environment.apiUrl}/currency/getAll`, this.httpOptions)
  }
}
