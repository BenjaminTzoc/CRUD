import { Injectable } from '@angular/core';
import { LoginModel } from '../models/login.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private URL = 'http://localhost:3000/api/user';
  msg$ = new BehaviorSubject<string | null>(null);
  public readonly currentLoginMsg: Observable<any> = this.msg$.asObservable();

  constructor(private httpClient: HttpClient, private router: Router) { }

  login(loginModel: LoginModel) {
    this.httpClient.post<{statusCode: number, message: string, token: string}>(`${this.URL}/login`, loginModel)
      .pipe(
        tap(response => {
          console.log(response);
          localStorage.setItem('access_token', response.token);
          this.goAdminPage();
        }),
        catchError(err => {
          this.msg$.next(err.error.message);
          return throwError(() => err);
        })
      ).subscribe();
  }

  logout() {
    localStorage.clear();
    this.goLoginPage();
  }

  isLoggedIn() { 
    if (localStorage.getItem('access_token') != null){
      this.goAdminPage();
    }
  }

  getToken() {
    const userToken = localStorage.getItem('access_token');
    return userToken;
  }

  private goAdminPage() {
    this.router.navigate(['/admin']);
  }

  register(user: UserModel) {
    return this.httpClient.post(`${this.URL}/`, user, { observe: 'response', responseType: 'json'});
  }

  private goLoginPage(){
    this.router.navigate(['/auth/login']);
  }
}
