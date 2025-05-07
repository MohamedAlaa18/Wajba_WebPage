import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { JwtService } from '../../Services/Jwt/jwt.service';
import { IUser } from '../../Models/user';


@Injectable({
  providedIn: 'root'
})
export class OrderTypeRedirectGuard implements CanActivate {
  constructor(private router: Router, private jwtService: JwtService) { }

  canActivate(): boolean | UrlTree {
    const token = this.jwtService.getToken(); // Make sure this function exists in JwtService
    const user: IUser | null = token ? this.jwtService.getUserIdFromToken(token) : null;

    const bookingData = localStorage.getItem('bookingData');
    const isUserEmpty = !user || Object.keys(user).length === 0;

    if (isUserEmpty && !bookingData) {
      return this.router.parseUrl('/orderType');
    }

    return true;
  }
}
