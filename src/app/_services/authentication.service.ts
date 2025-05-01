import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from '../_models/user';
import {ApiUrlHolder} from "./api-url-holder";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private apiUrlHolder: ApiUrlHolder,
    private router: Router
  ) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  login(username: string, password: string){
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + window.btoa(username + ":" + password),
        'Accept-Language': 'en'
      })
    };

    return this.http.get<any>(`${this.apiUrlHolder.getApiUrl()}user/authenticate`,
      httpOptions)
      .pipe(map(user => {
        user.authdata = window.btoa(username + ":" + password);
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        // return user;
      }))
  }


  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  register(userdata: User) {
    console.log(userdata.password);
    console.log(userdata.username);
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<any>(`${this.apiUrlHolder.getApiUrl()}user/add`,
      userdata,
      httpOptions)
      .pipe(map(user => {
        user.authdata = window.btoa(user.username + ":" + user.password);
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }))
  }
}
