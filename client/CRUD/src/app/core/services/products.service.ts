import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private URL = 'http://localhost:3000/api/product';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getProducts(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(this.URL, { headers });
  }

  addProduct(product: { name: string, price: number }): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.URL, product, { headers });
  }

  updateProduct(productId: number, product: { name?: string, price?: number, status?: boolean }): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.URL}/${productId}`, product, { headers });
  }

  deleteProduct(productId: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.URL}/${productId}`, { headers });
  }
}
