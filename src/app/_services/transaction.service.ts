import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Transaction } from '../_models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private http: HttpClient,
  ) { }


  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${environment.apiUrl}/transaction/getAll`)
  }

  getTransactionsByNode(id: string): Observable<Transaction[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      params: new HttpParams().set('nodeId', id)
    };
    return this.http.get<Transaction[]>(`${environment.apiUrl}/transaction/getAllByNode`,
      httpOptions);
  }

  addTransaction(transaction: Transaction): Observable<Transaction> {
    console.log('New Transaction adding: ', transaction);
    return this.http.post<Transaction>(`${environment.apiUrl}/transaction/add`, transaction, this.httpOptions)
  }

  editTransaction(transaction: Transaction): Observable<Transaction> {
    console.log('Edited transaction: ', transaction)
    return this.http.put<Transaction>(`${environment.apiUrl}/transaction/edit`, transaction, this.httpOptions)
  }
}
