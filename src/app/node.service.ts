import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FinancialNode } from './node-list/financial-node';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  private heroesUrl = 'http://localhost:8080/node/getAll';  // URL to web api
  private authURL = 'http://localhost:8080/authenticate';  // URL to web api

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
    return this.http.get<FinancialNode[]>(this.heroesUrl, this.httpOptions)
  }

  auth(): void {
    this.http.get(this.authURL, this.httpOptions)
  }

}
