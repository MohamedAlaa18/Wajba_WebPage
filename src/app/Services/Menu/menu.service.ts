import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  URL = environment.API_KEY;

  constructor(private httpClient: HttpClient) { }

  getAllMenuItems(): Observable<any> {
    return this.httpClient.get(`${this.URL}/menu`);
  }

  getMenuItemById(itemId: number): Observable<any> {
    return this.httpClient.get(`${this.URL}/menu/${itemId}`);
  }

  DeleteMenuItemById(itemId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.URL}/menu/${itemId}`);
  }
}
