import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Summary } from '../_models/summary';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  
  constructor(
    private http: HttpClient,
  ) { }

  getSummary(): Observable<Summary> {
    return this.http.get<Summary>(`${environment.apiUrl}/summary/sum`, this.httpOptions);
  }
}
