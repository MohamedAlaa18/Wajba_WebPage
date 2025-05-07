import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  URL = environment.API_KEY;

  constructor(private httpClient: HttpClient) { }

  // Get all categories
  getAllCategories(): Observable<any> {
    return this.httpClient.get(`${this.URL}/api/Category/AllCategories`);
  }

  // Get category by ID
  getCategoryById(id: number): Observable<any> {
    return this.httpClient.get(`${this.URL}/api/Category/GetByid${id}`);
  }
}
