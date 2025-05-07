import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DineInFormComponent } from "../dine-in-form/dine-in-form.component";
import { FormsModule } from '@angular/forms';
import { PickupFormComponent } from "../pickup-form/pickup-form.component";
import { DriveThruFormComponent } from "../drive-thru-form/drive-thru-form.component";
import { DeliveryFormComponent } from "../delivery-form/delivery-form.component";
import { Router } from '@angular/router';
import { SnackbarService } from '../../../Services/Snackbar/snackbar.service';

@Component({
  selector: 'app-order-type-modal',
  standalone: true,
  imports: [CommonModule, DineInFormComponent, FormsModule, PickupFormComponent, DriveThruFormComponent, DeliveryFormComponent],
  templateUrl: './order-type-modal.component.html',
  styleUrl: './order-type-modal.component.scss'
})
export class OrderTypeModalComponent {
  @Input() isModalOpen: boolean = false;

  @Output() closeModalEvent = new EventEmitter<void>();

  activeButton: string = 'Delivery';

  constructor(
    private router: Router,
    private snackbarService: SnackbarService
  ) { }

  closeModal() {
    const bookingData = localStorage.getItem('bookingData');
    if (bookingData) {
      this.router.navigate(['/']);
      this.snackbarService.showMessage('The type of order has been determined successful!');
    }
    this.closeModalEvent.emit();
  }

  setActiveButton(button: string) {
    this.activeButton = button;
  }
}
