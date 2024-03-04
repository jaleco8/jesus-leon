import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) {}

  getProducts(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        authorId: '22688424',
        Accept: '*/*',
      }),
    };

    return this.httpClient.get<any>(`${this.baseUrl}/bp/products`, httpOptions);
  }
}
