import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Transaction} from '../_models/transaction';
import {ApiUrlHolder} from "./api-url-holder";

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
    private apiUrlHolder: ApiUrlHolder
  ) {
  }


  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrlHolder.getApiUrl()}transaction/getAll`)
  }

  getTransactionsByNode(id: string): Observable<Transaction[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      params: new HttpParams().set('nodeId', id)
    };
    return this.http.get<Transaction[]>(`${this.apiUrlHolder.getApiUrl()}transaction/getAllByNode`,
      httpOptions);
  }

  addTransaction(transaction: Transaction): Observable<Transaction> {
    console.log('New Transaction adding: ', transaction);
    return this.http.post<Transaction>(`${this.apiUrlHolder.getApiUrl()}transaction/add`, transaction, this.httpOptions)
  }

  editTransaction(transaction: Transaction): Observable<Transaction> {
    console.log('Edited transaction: ', transaction)
    return this.http.put<Transaction>(`${this.apiUrlHolder.getApiUrl()}transaction/edit`, transaction, this.httpOptions)
  }

  cancelTransaction(transaction: Transaction): Observable<Transaction> {
    console.log('Cancelling transaction: ', transaction)
    return this.http.delete<Transaction>(`${this.apiUrlHolder.getApiUrl()}transaction/cancel?transactionId=` + transaction.id, this.httpOptions)
  }

  restoreTransaction(transaction: Transaction): Observable<Transaction> {
    console.log('Restoring transaction: ', transaction)
    return this.http.put<Transaction>(`${this.apiUrlHolder.getApiUrl()}transaction/restore?transactionId=` + transaction.id, this.httpOptions)
  }

  move(transaction: Transaction, indexForSwap: string | undefined): Observable<Transaction> {
    console.log('Moving transaction up: ', transaction)
    return this.http.put<Transaction>(`${this.apiUrlHolder.getApiUrl()}transaction/swapOrder?transactionId=` + transaction.id + '&indexForSwap=' + indexForSwap, this.httpOptions)
  }
}
