import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtService } from '../Jwt/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  URL = environment.API_KEY;

  constructor(
    private httpClient: HttpClient,
    private jwtService: JwtService,
  ) { }

  placeOrder(orderData: any): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.post<any>(`${this.URL}/api/Order`, orderData, { headers });
  }
}
