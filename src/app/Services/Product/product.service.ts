import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  URL = environment.API_KEY;
  URL_2 = 'http://localhost:2000';

  constructor(private httpClient: HttpClient) { }

  getAllPopularItems(): Observable<any> {
    return this.httpClient.get(`${this.URL}/product`);
  }

  // Get all items
  getAllProducts(): Observable<any> {
    return this.httpClient.get(`${this.URL}/api/Item/GetAll`);
  }

  // Get item by ID
  getProductItemById(itemId: number): Observable<any> {
    return this.httpClient.get(`${this.URL}/api/Item/GetById/${itemId}`);
  }

  // Get item by ID
  getProductItemDetails(itemId: number): Observable<any> {
    return this.httpClient.get(`${this.URL}/api/Item/${itemId}/details`);
  }

  // Get items by category
  getItemsByCategory(categoryId: number): Observable<any> {
    return this.httpClient.get(`${this.URL}/api/Item/GetItemsByCategory/${categoryId}`);
  }

  // (Optional) Delete item by ID - This was in your initial code but not part of the API provided above
  deleteProductItemById(itemId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.URL}/api/Item/Delete/${itemId}`);
  }
}
