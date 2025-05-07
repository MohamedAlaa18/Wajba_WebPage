import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  URL = environment.API_KEY;

  constructor(private http: HttpClient) { }

  getBranchByRestaurantId(restaurantId: number): Observable<any> {
    return this.http.get<any>(`${this.URL}/api/Branch/restaurant/${restaurantId}`);
  }
}
