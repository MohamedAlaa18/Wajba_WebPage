import { Component, Output, EventEmitter } from '@angular/core';
import { ICart, ICartItem } from '../../../Models/cart';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../Services/Cart/cart.service';
import { IconComponent } from '../../Shared/icon/icon.component';
import { SnackbarService } from '../../../Services/Snackbar/snackbar.service';
import { Router } from '@angular/router';
import { AddToCartModalComponent } from '../../Dialog/add-to-cart-modal/add-to-cart-modal.component';

@Component({
  selector: 'app-cart-content',
  imports: [CommonModule, IconComponent, AddToCartModalComponent],
  standalone: true,
  templateUrl: './cart-content.component.html',
  styleUrls: ['./cart-content.component.scss']
})
export class CartContentComponent {
  cart!: ICart;
  selectedItem!: ICartItem;

  @Output() close = new EventEmitter<void>();

  isEditModalOpen = false;

  constructor(
    private cartService: CartService,
    private snackbarService: SnackbarService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    // First check if the cart is already available in the service
    const savedCart = this.cartService.getSavedCart();
    if (savedCart) {
      this.cart = savedCart.data;
    } else {
      // If not, fetch it from the server
      this.cartService.getCart().subscribe(
        cart => {
          this.cart = cart.data;
          console.log(this.cart);
        },
        error => {
          console.error('Failed to load cart items', error);
        }
      );
    }
  }

  trackByIndex(index: number, item: ICartItem) {
    return index;
  }

  closeCart() {
    this.close.emit();
  }

  onCheckout() {
    const checkoutNote = (document.getElementById('note') as HTMLTextAreaElement).value;

    this.cartService.checkout(checkoutNote).subscribe({
      next: (response) => {
        if (response.success !== false) {
          console.log('Checkout successful:', response);
          this.router.navigate(['/checkout']);
          this.close.emit();
        } else {
          console.error('Checkout error:', response);
        }
      },
      error: (error) => {
        console.error('Checkout error:', error);
      }
    });
  }

  onRemove(cartItemId: number) {
    this.cartService.deleteCartItemById(cartItemId).subscribe({
      next: () => {
        console.log(`Item with ID ${cartItemId} removed successfully`);
        this.loadCart();
      },
      error: () => {
        console.error('Failed to remove item from cart');
      }
    });
  }

  incrementQuantity(cartItem: ICartItem) {
    const newQuantity = cartItem.quantity + 1;
    this.cartService.updateCartItemQuantity(cartItem.cartItemId, newQuantity).subscribe({
      next: () => {
        console.log(`Quantity for item ${cartItem.cartItemId} increased to ${newQuantity}`);
        this.loadCart();
      },
      error: (err) => {
        console.error('Error incrementing item quantity:', err);
      }
    });
  }

  decrementQuantity(cartItem: ICartItem) {
    if (cartItem.quantity > 1) {
      const newQuantity = cartItem.quantity - 1;
      this.cartService.updateCartItemQuantity(cartItem.cartItemId, newQuantity).subscribe({
        next: () => {
          console.log(`Quantity for item ${cartItem.cartItemId} decreased to ${newQuantity}`);
          this.loadCart();
        },
        error: (err) => {
          console.error('Error decrementing item quantity:', err);
        }
      });
    } else {
      console.warn(`Cannot decrement quantity for item ${cartItem.cartItemId} below 1`);
    }
  }

  openAddModal(item: ICartItem) {
    this.selectedItem = item;
    this.isEditModalOpen = true;
  }

  closeAddModal() {
    this.isEditModalOpen = false;
    this.loadCart();
  }

  clear() {
    this.cartService.clearCart().subscribe(
      response => {
        console.log('Cart cleared successfully:', response);
        this.loadCart();
      },
      error => {
        console.error('Error clearing cart:', error);
      }
    );
  }

  applyVoucher() {
    const voucherCode = (document.getElementById('voucherCode') as HTMLTextAreaElement).value;

    this.cartService.applyVoucherCode(voucherCode).subscribe(
      (response) => {
        if (response.success === false) {
          this.snackbarService.showMessage(response.message, true);
          console.error('Error applying voucher', response);
        } else {
          console.log('Voucher applied successfully', response);
          this.snackbarService.showMessage(response.message);
          this.loadCart();
        }
      },
      (error) => {
        console.error('Error applying voucher', error);
      }
    );
  }
}
