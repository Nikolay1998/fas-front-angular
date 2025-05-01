import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Currency} from '../_models/currency';
import {ApiUrlHolder} from "./api-url-holder";


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
    private http: HttpClient,
    private apiUrlHolder: ApiUrlHolder
  ) { }

  updateCurrency() {
    this.getCurrencys().subscribe(cur => this.summarySource.next(cur))
  }

  private getCurrencys(): Observable<Currency[]> {
    return this.http.get<Currency[]>(`${this.apiUrlHolder.getApiUrl()}currency/getAll`, this.httpOptions)
  }
}
