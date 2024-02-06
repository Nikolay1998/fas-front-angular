import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FinancialNode } from '../_models/financial.node';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic eHl6Onh5eg=='
    })
  };

  constructor(
    private http: HttpClient,
  ) { }

  getNodes(): Observable<FinancialNode[]> {
    // this.auth();
    console.log("get");
    
    return this.http.get<FinancialNode[]>(`${environment.apiUrl}/node/getAll`, this.httpOptions)
  }
}
