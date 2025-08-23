import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Currency} from '../_models/currency';
import {ApiUrlHolder} from "./api-url-holder";


@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private emptyCurrencies: Currency[] = []
  private currencySource = new BehaviorSubject(this.emptyCurrencies);
  currentCurerncies = this.currencySource.asObservable();


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
    this.getCurrencies().subscribe(cur => this.currencySource.next(cur))
  }

  private getCurrencies(): Observable<Currency[]> {
    return this.http.get<Currency[]>(`${this.apiUrlHolder.getApiUrl()}currency/getAll`, this.httpOptions)
  }
}
