import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { IUser } from '../../Models/user';
import { environment } from '../../../environments/environment.development';
import { JwtService } from '../Jwt/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  URL = environment.API_KEY;

  constructor(private httpClient: HttpClient, private jwtService: JwtService) {
    const token = this.jwtService.getToken();
    if (token) {
      this.jwtService.setToken(token);
    }
  }

  register(user: IUser): Observable<any> {
    return this.httpClient.post<any>(`${this.URL}/api/Customer/register`, user);
  }

  login(credentials: { phone: string }): Observable<any> {
    return this.httpClient.post<any>(`${this.URL}/api/Customer/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          this.jwtService.setToken(response.token);
        }
      })
    );
  }

  logout(): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Ensure the request URL uses HTTPS
    return this.httpClient.post<any>(`https://api.wajba.net/api/Customer/logout`, {}, { headers }).pipe(
      tap(() => {
        this.jwtService.setToken(null);
      })
    );
  }

  getCustomerById(id: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.jwtService.getToken()}`);
    return this.httpClient.get<any>(`${this.URL}/api/Customer/${id}`, { headers });
  }

  sendOTP(phone: string): Observable<any> {
    const requestBody = { phone: phone };
    return this.httpClient.post<any>(`${this.URL}/api/PasswordReset/request-reset`, requestBody);
  }

  verifyOTP(otpData: { phone: string; otp: string }): Observable<any> {
    return this.httpClient.post<any>(`${this.URL}/api/PasswordReset/verify-otp`, otpData);
  }

  resetPassword(passwordData: { email: string; newPassword: string; confirmPassword: string }): Observable<any> {
    return this.httpClient.post<any>(`${this.URL}/api/PasswordReset/reset-password`, passwordData);
  }

  checkCustomerEmail(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.httpClient.get<any>(`${this.URL}/api/PasswordReset/CheckCustomerEmail`, { params });
  }

  checkIfVerified(email: string): Observable<any> {
    // Append the email as a query parameter in the URL
    return this.httpClient.post<any>(`${this.URL}/api/PasswordReset/check-If-Verified?email=${email}`, {});
  }
}
