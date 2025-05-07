import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { IProductItem } from '../../../Models/product-item';
import { ICartItem } from '../../../Models/cart';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../Shared/icon/icon.component';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormsModule, Validators } from '@angular/forms';
import { CartService } from '../../../Services/Cart/cart.service';
import { SnackbarService } from '../../../Services/Snackbar/snackbar.service';

@Component({
  selector: 'app-add-to-cart-modal',
  standalone: true,
  imports: [CommonModule, IconComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './add-to-cart-modal.component.html',
  styleUrls: ['./add-to-cart-modal.component.scss']
})
export class AddToCartModalComponent implements OnChanges, OnInit {
  @Input() isModalOpen: boolean = false;
  @Input() isEditMode: boolean = false;
  @Input() productItem!: IProductItem;
  @Input() cartItem!: ICartItem;
  @Output() closeModalEvent = new EventEmitter<void>();

  quantity: number = 1;
  specialInstructions: string = '';
  cartForm!: FormGroup;

  addedExtras: { name: string; additionalPrice: number }[] = [];

  constructor(
    // private productService: ProductService,
    private cartService: CartService,
    private fb: FormBuilder,
    private snackbarService: SnackbarService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.addedExtras = [];
    console.log(this.productItem);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isModalOpen'] && this.isModalOpen) {
      if (this.isEditMode) {
        this.quantity = this.cartItem.quantity;
      }

      if (this.productItem) {
        this.createForm(); // Re-create the form (or reset if needed)
        this.populateForm(); // Now populate the FormArrays based on productItem
      }

      this.resetExtras();
    }
  }

  resetExtras() {
    this.addedExtras = [];
  }

  createForm() {
    this.cartForm = this.fb.group({
      quantity: [this.quantity],
      specialInstructions: [''],
      variations: this.fb.array([], Validators.required),
      addons: this.fb.array([])
    });
  }

  // loadProductDetails(itemId: number) {
  //   this.productService.getProductItemDetails(itemId).subscribe(
  //     (productDetails) => {
  //       this.product = productDetails.data;
  //       this.populateForm();
  //     },
  //     (error) => {
  //       console.error('Error fetching product details:', error);
  //     }
  //   );
  // }

  populateForm() {
    this.cartForm.patchValue({
      quantity: this.quantity,
      specialInstructions: this.specialInstructions,
    });

    this.variations.clear();
    this.addons.clear();

    // Populate variations
    this.productItem.attributes.forEach((attribute, index) => {
      const control = this.fb.control(null, Validators.required);
      this.variations.push(control);
    });

    // Populate addons
    this.productItem.itemAddons.forEach((addon, index) => {
      const control = this.fb.control(false);
      this.addons.push(control);
    });

    if (this.isEditMode) {
      this.cartForm.patchValue({
        specialInstructions: this.cartItem.notes,
        quantity: this.cartItem.quantity,
      });

      this.addedExtras = this.cartItem.extras || [];
    }
  }

  get variations(): FormArray {
    return this.cartForm.get('variations') as FormArray;
  }

  get addons(): FormArray {
    return this.cartForm.get('addons') as FormArray;
  }

  incrementQuantity(e: Event) {
    e.preventDefault();
    this.quantity += 1;
    this.cartForm.patchValue({ quantity: this.quantity });
  }

  decrementQuantity(e: Event) {
    e.preventDefault();
    if (this.quantity > 1) {
      this.quantity -= 1;
      this.cartForm.patchValue({ quantity: this.quantity });
    }
  }

  closeModal() {
    this.cartForm.reset();
    this.closeModalEvent.emit();
  }

  calculateTotalPrice(): number {
    const formValues = this.cartForm.value;
    let totalPrice = this.productItem.price * formValues.quantity;

    this.productItem.attributes.forEach((attr, index) => {
      const variation = formValues['variation_' + index];
      const selectedVariation = attr.variations.find(v => v.id === variation);
      if (selectedVariation) {
        totalPrice += selectedVariation.additionalPrice;
      }
    });

    const selectedAddons = this.productItem.itemAddons
      .filter((_, index) => formValues['addon_' + index])
      .map(addon => addon.price);

    const selectedExtras = this.addedExtras
      .map(extra => extra.additionalPrice);

    totalPrice += selectedAddons.reduce((acc, price) => acc + price, 0);
    totalPrice += selectedExtras.reduce((acc, price) => acc + price, 0);

    return totalPrice;
  }

  addExtra(extra: { name: string; additionalPrice: number }) {
    const index = this.productItem.itemExtras.findIndex(e => e.name === extra.name);
    if (index !== -1) {
      this.productItem.itemExtras.splice(index, 1);
    }

    this.addedExtras.push(extra);
  }

  isExtraAdded(extra: { name: string; additionalPrice: number }): boolean {
    return this.addedExtras.some(addedExtra => addedExtra.name === extra.name);
  }

  onSubmit() {
    console.log(this.cartForm)
    if (this.cartForm.invalid) {
      console.error('Form is invalid, please ensure all required fields are filled.');
      this.snackbarService.showMessage('Please choose the variations', true)
      return;
    }

    const formValues = this.cartForm.value;

    const item = {
      itemId: this.productItem.id,
      itemName: this.productItem.name,
      quantity: formValues.quantity,
      ImgUrl: this.productItem.imageUrl,
      notes: formValues.specialInstructions || '',
      price: this.productItem.price,
      variations: this.productItem.attributes.map((attr, index) => ({
        name: attr.attributeName,
        additionalPrice: attr.variations.find(v => v.id === formValues['variation_' + index])?.additionalPrice || 0,
        attributeName: attr.attributeName,
      })),
      addons: this.productItem.itemAddons
        .map((addon, index) => ({
          name: addon.name,
          price: addon.price,
          selected: formValues['addon_' + index] || false
        }))
        .filter(addon => addon.selected),
      extras: this.addedExtras.map(extra => ({
        name: extra.name,
        additionalPrice: extra.additionalPrice
      }))
    };

    if (this.isEditMode) {
      // Update the existing cart item
      this.cartService.updateCartItem(this.cartItem.cartItemId, item).subscribe(
        (response) => {
          if (response.success === false) {
            console.error('Error updating cart item:', response);
          } else {
            console.log('Cart item updated:', response);
            this.closeModal();
          }
        },
        (error) => {
          console.error('Error updating cart item:', error);
        }
      );
    } else {
      // Add a new item to the cart
      this.cartService.addItemToCart(item).subscribe(
        (response) => {
          if (response.success === false) {
            if (response.message === 'Invalid token or customer not found') {
              localStorage.setItem('cartItem', JSON.stringify(item));
              console.log('Item saved to local storage due to invalid token or customer not found');
              this.closeModal();
            }
            console.error('Error adding item to cart:', response);
          } else {
            console.log('Item added to cart:', response);
            this.closeModal();
          }
        },
        (error) => {
          console.error('Error adding item to cart:', error);
        }
      );
    }
  }
}
