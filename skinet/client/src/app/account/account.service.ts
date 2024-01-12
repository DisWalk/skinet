import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, ReplaySubject, map, of } from 'rxjs';
import { User } from '../shared/models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  // private currentUserSource = new BehaviorSubject<User | null>(null);
  private currentUserSource = new ReplaySubject<User | null>(1);
  //when we refresh the checkout page, i.e when appln starts
  //BehaviorSubject currentUserSource will be null
  //that's why auth is null and page redirects to login
  //so we replace BehaviorSubject with ReplaySubject
  //ReplaySubject doesnt have an initial value
  //auth guard wont do anything until we have initial value in user observable
  //(1) is saying to store 1 user only i.e. current user
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }
  
  loadCurrentUser(token: string | null) {

    if (token === null) {
      this.currentUserSource.next(null);
      return of(null);
      //returning observable of null as below code is returning observable
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    
    return this.http.get<User>(this.baseUrl + 'account', { headers }).pipe(
      map(user => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
          return user;
        } else {
          return null;
        }
      })
    );
  }

  login(values: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', values).pipe(
      map(user => {
        localStorage.setItem('token', user.token);
        this.currentUserSource.next(user);
      })
    )
    //we wil pass email and password to api
    //api will return user.ts i.e. email displayName and token
    //we will save that token in User's browser's local storage
    //so that they dont have to login everytime
    //like we use amazon, flipcart 
  }

  register(values: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', values).pipe(
      map(user => {
        localStorage.setItem('token', user.token);
        this.currentUserSource.next(user);
      }) 
    )
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email: string) {
    return this.http.get<boolean>(this.baseUrl + 'account/emailExists?email=' + email);
  }
}
