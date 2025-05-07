import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private authTokenSubject = new BehaviorSubject<string | null>(null);
  authToken$: Observable<string | null> = this.authTokenSubject.asObservable();

  decodeToken(token: string): any {
    if (!token) {
      return null;
    }

    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return null;
    }

    const payload = tokenParts[1];

    // Replace URL-specific characters and add missing padding if necessary
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');

    const decodedPayload = atob(paddedBase64);
    return JSON.parse(decodedPayload);
  }

  getUserIdFromToken(token: string): any | null {
    const decodedToken = this.decodeToken(token);
    // console.log(decodedToken);
    return decodedToken ? decodedToken.Id : null;
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';
  }

  getToken(): string | null {
    if (this.isBrowser()) {
      return sessionStorage.getItem('authToken');
    }
    return null;
  }

  saveToken(token: string): void {
    if (this.isBrowser()) {
      sessionStorage.setItem('authToken', token);
    }
  }

  setToken(token: string | null): void {
    if (this.isBrowser()) {
      if (token) {
        sessionStorage.setItem('authToken', token);
      } else {
        sessionStorage.removeItem('authToken');
      }
      this.authTokenSubject.next(token);
    }
  }
}
