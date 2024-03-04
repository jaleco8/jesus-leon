import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  baseUrl = environment.baseUrl;
  Id = environment.authotId;

  constructor(private httpClient: HttpClient) {}

  getProducts(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        authorId: this.Id,
      }),
    };

    return this.httpClient.get<any>(`${this.baseUrl}/bp/products`, httpOptions);
  }

  getProductById(id: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        authorId: this.Id,
      }),
    };

    return this.httpClient.get<any>(
      `${this.baseUrl}/bp/products/verification?id=${id}`,
      httpOptions
    );
  }

  createProduct(product: Product): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        authorId: this.Id,
      }),
    };

    return this.httpClient.post<any>(
      `${this.baseUrl}/bp/products`,
      product,
      httpOptions
    );
  }
}
