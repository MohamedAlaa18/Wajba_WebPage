import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ICart, ICartItem } from '../../../Models/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout-content.component.html',
  styleUrls: ['./checkout-content.component.scss']
})
export class CheckoutContentComponent implements OnInit {
  @Output() placeOrder = new EventEmitter<void>();
  cart!: ICart;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cart = {
      customerId: 'static-user-123',
      deliveryFee: 5.0,
      serviceFee: 2.0,
      voucherCode: 123456,
      discountAmount: 3.0,
      note: 'Leave at the front door',
      items: [
        {
          itemName: 'Cheeseburger',
          itemId: 1,
          cartItemId: 101,
          imgUrl: 'assets/images/burger.jpeg',
          price: 8.99,
          quantity: 2,
          variations: [
            {
              id: 1,
              name: 'Large',
              attributeName: 'Size',
              additionalPrice: 1.5
            }
          ],
          addons: [],
          extras: [],
          notes: 'No onions, please.'
        },
        {
          itemName: 'Coffee',
          itemId: 2,
          cartItemId: 102,
          imgUrl: 'assets/images/coffee.jpeg',
          price: 3.5,
          quantity: 1,
          variations: [],
          addons: [],
          extras: [],
          notes: ''
        }
      ],
      subTotal: 21.98,
      totalAmount: 25.98
    };
  }

  onPlaceOrderClicked() {
    this.placeOrder.emit();
  }

  onNewCardSelected() {
    this.router.navigate(['/newCard']);
  }

  trackByIndex(index: number, item: ICartItem) {
    return index;
  }

  applyVoucher() {
    // Stub implementation since we removed service logic
    const voucherCode = (document.getElementById('voucherCode') as HTMLTextAreaElement).value;
    console.log(`Pretending to apply voucher code: ${voucherCode}`);
    alert('Voucher code applied (mock).');
  }
}
