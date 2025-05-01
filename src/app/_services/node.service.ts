import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {FinancialNode} from '../_models/financial.node';
import {ApiUrlHolder} from "./api-url-holder";

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
    private apiUrlHolder: ApiUrlHolder
  ) {
  }

  getNodes(): Observable<FinancialNode[]> {
    return this.http.get<FinancialNode[]>(`${this.apiUrlHolder.getApiUrl()}node/getAll`, this.httpOptions)
  }

  addNode(node: FinancialNode): Observable<FinancialNode> {
    console.log('New Node adding: ', node.name, node.external, node.currencyId);
    return this.http.post<FinancialNode>(`${this.apiUrlHolder.getApiUrl()}node/add`, node, this.httpOptions)
  }

  editNode(node: FinancialNode): Observable<FinancialNode> {
    console.log('Node edit: {}', node.name, node.external);
    return this.http.put<FinancialNode>(`${this.apiUrlHolder.getApiUrl()}node/edit`, node, this.httpOptions)
  }

  archiveNode(node: FinancialNode): Observable<FinancialNode> {
    console.log('Archiving node: {}', node.name);
    return this.http.put<FinancialNode>(`${this.apiUrlHolder.getApiUrl()}node/archive?nodeId=` + node.id, this.httpOptions)
  }

  restoreNode(node: FinancialNode): Observable<FinancialNode> {
    console.log('Restoring node: {}', node.name);
    return this.http.put<FinancialNode>(`${this.apiUrlHolder.getApiUrl()}node/restore?nodeId=` + node.id, this.httpOptions)
  }
}
