import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { FinancialNode } from '../_models/financial.node';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private http: HttpClient,
  ) { }

  getNodes(): Observable<FinancialNode[]> {
    return this.http.get<FinancialNode[]>(`${environment.apiUrl}/node/getAll`, this.httpOptions)
  }
}
