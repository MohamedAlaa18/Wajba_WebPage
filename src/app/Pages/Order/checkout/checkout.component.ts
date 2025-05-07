import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../Services/Order/order.service';
import { CheckoutContentComponent } from '../checkout-content/checkout-content.component';
import { OrderTypeInfoComponent } from "../order-type-info/order-type-info.component";
import { ApproximateTimeService } from '../../../Services/ApproximateTime/approximate-time.service';
import { SnackbarService } from '../../../Services/Snackbar/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CheckoutContentComponent, CommonModule, OrderTypeInfoComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  @Output() cart = new EventEmitter<void>();

  selectedBranch!: any;
  bookingData: any;

  constructor(
    private orderService: OrderService,
    private approximateTimeService: ApproximateTimeService,
    private snackbarService: SnackbarService,
    private router: Router,
  ) {
    this.selectedBranch = localStorage.getItem('selectedBranch');
    this.bookingData = localStorage.getItem('bookingData');

    this.getBranchName();
    this.getOrderType();
  }

  getBranchName() {
    if (this.selectedBranch) {
      const branch = JSON.parse(this.selectedBranch);
      this.selectedBranch = branch;
    }
  }

  getOrderType() {
    if (this.bookingData) {
      const branch = JSON.parse(this.bookingData);
      this.bookingData = branch;
    }
  }

  placeOrder(): void {
    const bookingData: any = localStorage.getItem('bookingData');

    if (!bookingData) {
      console.error('No booking data found');
      return;
    }

    const parsedBookingData = JSON.parse(bookingData);
    const selectedBranch = JSON.parse(localStorage.getItem('selectedBranch') || '{}');

    const orderData: any = {
      status: 0,
      ordertype: this.getOrderTypeValue(),
      paymentMethod: 1,
      branchId: this.getBranchId(),
    };

    switch (this.bookingData.type) {
      case 'pickup':
        orderData.pickUpOrder = {
          time: parsedBookingData.time,
          branchId: this.getBranchId()
        };
        break;

      case 'delivery':
        const distanceKm = this.approximateTimeService.getDistanceFromLatLonInKm(
          parsedBookingData.latLng.lat,
          parsedBookingData.latLng.lng,
          selectedBranch.latitude,
          selectedBranch.longitude
        );

        const approximateTime = this.approximateTimeService.getApproximateTimeWithISOString(distanceKm);

        orderData.deliveryOrder = {
          title: parsedBookingData.location || this.selectedBranch.name,
          longitude: parsedBookingData.latLng.lng,
          latitude: parsedBookingData.latLng.lat,
          approximateTime,
          branchId: this.getBranchId()
        };
        break;

      case 'drive thru':
        orderData.driveThruOrder = {
          time: parsedBookingData.time,
          date: new Date().toISOString().split('T')[0],
          branchId: this.getBranchId(),
          carColor: parsedBookingData.carColor || "unknown",
          carType: parsedBookingData.carType || "unknown",
          carNumber: parsedBookingData.carNumber || "unknown"
        };
        break;

      case 'dine in':
        orderData.dineInOrder = {
          time: parsedBookingData.time,
          numberOfPersons: parsedBookingData.persons || 1,
          date: parsedBookingData.date || new Date().toISOString().split('T')[0],
          branchId: this.getBranchId()
        };
        break;

      default:
        console.error('Unknown order type');
        return;
    }

    console.log('Order Data:', orderData);

    this.orderService.placeOrder(orderData).subscribe({
      next: (response) => {
        if (response.success === false) {
          console.error('Error placing order:', response);
        } else {
          console.log('Order placed successfully:', response);
          this.snackbarService.showMessage('Your order has been added successfully')
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('Error placing order:', error);
      }
    });
  }

  private getOrderTypeValue(): number {
    switch (this.bookingData.type) {
      case 'delivery':
        return 1;
      case 'drive-thru':
        return 2;
      case 'dine-in':
        return 3;
      case 'pickup':
        return 4;
      default:
        return 0;
    }
  }

  private getBranchId(): number {
    const selectedBranch = JSON.parse(localStorage.getItem('selectedBranch') || '{}');
    return selectedBranch.id || 0;
  }
}
