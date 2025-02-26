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

  constructor(private http: HttpClient, private router: Router) { }

  login(loginModel: LoginModel): Observable<any> {
    return this.http.post<{statusCode: number, message: string, token: string}>(`${this.URL}/login`, loginModel);
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

  goAdminPage() {
    this.router.navigate(['/admin']);
  }

  register(user: UserModel) {
    return this.http.post(`${this.URL}/`, user, { observe: 'response', responseType: 'json'});
  }

  private goLoginPage(){
    this.router.navigate(['/auth/login']);
  }
}
