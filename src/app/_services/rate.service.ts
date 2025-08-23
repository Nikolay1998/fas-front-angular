import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiUrlHolder} from "./api-url-holder";

@Injectable({
    providedIn: 'root'
})
export class RateService {

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

    getEquivalents(currencyToAmount: Map<string, number>): Observable<Map<string, number>> {
        console.log("getting equivalent of: " + currencyToAmount)
        return this.http.post<Map<string, number>>(`${this.apiUrlHolder.getApiUrl()}rate/calculateEquivalents`, currencyToAmount, this.httpOptions);
    }
}
