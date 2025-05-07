import { Component, Input, OnInit } from '@angular/core';
import { JwtService } from '../../../Services/Jwt/jwt.service';
import { UserService } from '../../../Services/User/user.service';
import { IUser } from '../../../Models/user';
import { Subscription } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { IBranch } from '../../../Models/branch';
import { IconComponent } from "../../../Components/Shared/icon/icon.component";
import { GoogleMapsModule } from '@angular/google-maps';
import { ApproximateTimeService } from '../../../Services/ApproximateTime/approximate-time.service';

@Component({
  selector: 'app-order-type-info',
  standalone: true,
  imports: [CommonModule, IconComponent, GoogleMapsModule, DatePipe],
  templateUrl: './order-type-info.component.html',
  styleUrl: './order-type-info.component.scss'
})
export class OrderTypeInfoComponent implements OnInit {
  user!: IUser;
  token: string | null = null;
  tokenSubscription!: Subscription;
  approximateTime: string = '';
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
  };

  @Input() selectedBranch!: IBranch;
  @Input() bookingData: any;

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private approximateTimeService: ApproximateTimeService,
  ) { }

  ngOnInit(): void {
    this.tokenSubscription = this.jwtService.authToken$.subscribe(token => {
      this.token = token;
      this.updateUser();
    });

    if (this.bookingData && this.bookingData.latLng) {
      this.center = {
        lat: this.bookingData.latLng.lat,
        lng: this.bookingData.latLng.lng
      };
    }

    if (this.bookingData.type === 'delivery') {
      const distanceKm = this.approximateTimeService.getDistanceFromLatLonInKm(
        this.bookingData.latLng.lat,
        this.bookingData.latLng.lng,
        // this.selectedBranch.latitude,
        // this.selectedBranch.longitude
        25.276987, // Qatar latitude (Doha)
        51.520008  // Qatar longitude (Doha)
      );

      this.approximateTime = this.approximateTimeService.getApproximateTime(distanceKm)
    }
  }

  private updateUser(): void {
    if (this.token) {
      const userId = this.jwtService.getUserIdFromToken(this.token);

      if (userId) {
        this.userService.getCustomerById(userId).subscribe({
          next: (data) => {
            this.user = data.data;
          },
          error: (error) => {
            console.error('Failed to fetch user data', error);
          }
        });
      }
    } else {
      this.user = {} as IUser;
    }
  }
}
