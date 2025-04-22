import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import { FinancialNode } from '../_models/financial.node';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'responseType': 'text'
    })
  };

  constructor(
    private http: HttpClient,
  ) { }

  getNodes(): Observable<FinancialNode[]> {
    return this.http.get<FinancialNode[]>(`${environment.apiUrl}/node/getAll`, this.httpOptions)
  }

  addNode(node: FinancialNode): Observable<FinancialNode> {
    console.log('New Node adding: ', node.name, node.external, node.currencyId);
    return this.http.post<FinancialNode>(`${environment.apiUrl}/node/add`, node, this.httpOptions)
  }

  editNode(node: FinancialNode): Observable<FinancialNode> {
    console.log('Node edit: {}', node.name, node.external);
    return this.http.put<FinancialNode>(`${environment.apiUrl}/node/edit`, node, this.httpOptions)
  }

  archiveNode(node: FinancialNode): Observable<FinancialNode> {
    console.log('Archiving node: {}', node.name);
    return this.http.put<FinancialNode>(`${environment.apiUrl}/node/archive?nodeId=` + node.id, this.httpOptions)
  }

  restoreNode(node: FinancialNode): Observable<FinancialNode> {
    console.log('Restoring node: {}', node.name);
    return this.http.put<FinancialNode>(`${environment.apiUrl}/node/restore?nodeId=` + node.id, this.httpOptions)
  }
}
