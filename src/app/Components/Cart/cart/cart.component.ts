import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../Services/Cart/cart.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartContentComponent } from '../cart-content/cart-content.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CartContentComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  currentSection: string = 'cart';
  selectedOption: string = 'Delivery';
  cartIsOpen: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cartIsOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isOpen => {
        this.cartIsOpen = isOpen;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectOption(option: string): void {
    this.selectedOption = option;
  }

  closeCart(): void {
    this.cartService.setCartIsOpen(false);
  }
}
