import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { JwtService } from '../Jwt/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  URL = environment.API_KEY;

  private cartIsOpenSubject = new BehaviorSubject<boolean>(false);
  cartIsOpen$: Observable<boolean> = this.cartIsOpenSubject.asObservable();

  // New BehaviorSubject to hold the cart data
  private cartSubject = new BehaviorSubject<any | null>(null);
  cart$: Observable<any> = this.cartSubject.asObservable();  // Expose the cart as an observable

  constructor(
    private httpClient: HttpClient,
    private jwtService: JwtService
  ) { }

  setCartIsOpen(state: boolean): void {
    this.cartIsOpenSubject.next(state);
  }

  // Method to get cart data (either from cache or API)
  getCart(): Observable<any> {
    const token = this.jwtService.getToken();

    if (!token) {
      console.error("Token is missing or invalid.");
      return throwError("Token is missing or invalid.");
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Check if cart data is already fetched and cached
    if (this.cartSubject.getValue()) {
      return this.cart$;  // Return the cached cart data as an Observable
    }

    // If not fetched yet, make an API call and update the cartSubject
    return this.httpClient.get(`${this.URL}/api/Cart/get-cart`, { headers })
      .pipe(
        tap(cartData => this.cartSubject.next(cartData)),  // Update cartSubject with the fetched data
        catchError(error => {
          console.error("Error fetching cart items:", error);
          return throwError(error);
        })
      );
  }

  getSavedCart(): any {
    return this.cartSubject.getValue();
  }

  updateCartItem(cartItemId: number, itemData: {
    itemId: number;
    itemName: string;
    quantity: number;
    notes: string;
    price: number;
    variations: { name: string; additionalPrice: number; attributeName: string }[];
    addons: { name: string; price: number }[];
    extras: { name: string; additionalPrice: number }[];
  }): Observable<any> {
    const token = this.jwtService.getToken();

    if (!token) {
      console.error("Token is missing or invalid.");
      return throwError("Token is missing or invalid.");
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.httpClient.put(`${this.URL}/api/Cart/update-item/${cartItemId}`, itemData, { headers })
      .pipe(
        catchError(error => {
          console.error("Error updating cart item:", error);
          return throwError(error);
        })
      );
  }

  clearCart(): Observable<any> {
    const token = this.jwtService.getToken();

    if (!token) {
      console.error("Token is required.");
      return throwError("Token is required.");
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'accept': '*/*'
    });

    return this.httpClient.delete(`${this.URL}/api/Cart/clear-cart`, { headers })
      .pipe(
        tap(() => this.cartSubject.next(null)),  // Clear the cached cart data
        catchError(error => {
          console.error("Error clearing cart:", error);
          return throwError(error);
        })
      );
  }

  updateCartItemQuantity(cartItemId: number, quantityChange: number): Observable<any> {
    const token = this.jwtService.getToken();
    if (!token) {
      console.error("Token is missing or invalid.");
      return throwError("Token is missing or invalid.");
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const requestBody = {
      cartItemId,
      quantityChange
    };

    return this.httpClient.post(`${this.URL}/api/Cart/update-cartitem-quantity`, requestBody, { headers })
      .pipe(
        catchError(error => {
          console.error("Error updating cart item quantity:", error);
          return throwError(error);
        })
      );
  }

  getCartItemById(itemId: number): Observable<any> {
    return this.httpClient.get(`${this.URL}/api/Cart/Get-Items-In-cart/${itemId}`);
  }

  addItemToCart(item: {
    itemId: number;
    itemName: string;
    quantity: number;
    notes: string;
    price: number;
    variations: { name: string; additionalPrice: number; attributeName: string }[];
    addons: { name: string; price: number }[];
    extras: { name: string; additionalPrice: number }[];
  }): Observable<any> {
    const token = this.jwtService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.post(`${this.URL}/api/Cart/add-item-to-cart`, item, { headers });
  }

  deleteCartItemById(cartItemId: number): Observable<void> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.delete<void>(`${this.URL}/api/Cart/delete-item-from-cart/${cartItemId}`, { headers });
  }

  cartIsOpen(): boolean {
    return this.cartIsOpenSubject.getValue();
  }

  checkout(note: string): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const body = { note };
    return this.httpClient.post<any>(`${this.URL}/api/Cart/checkout`, body, { headers });
  }

  applyVoucherCode(code: string): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const body = { code };
    return this.httpClient.post(`${this.URL}/api/Cart/apply-voucher-code`, body, { headers });
  }
}
