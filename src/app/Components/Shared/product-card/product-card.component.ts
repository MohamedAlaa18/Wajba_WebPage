import { Component, Input } from '@angular/core';
import { IProductItem } from '../../../Models/product-item';
import { InfoModalComponent } from '../../Dialog/info-modal/info-modal.component';
import { AddToCartModalComponent } from "../../Dialog/add-to-cart-modal/add-to-cart-modal.component";

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [InfoModalComponent, AddToCartModalComponent],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {

  @Input() productItem!: IProductItem;

  isInfoModalOpen = false;
  isAddModalOpen = false;

  openInfoModal() {
    this.isInfoModalOpen = true;
  }

  closeInfoModal() {
    this.isInfoModalOpen = false;
  }

  openAddModal() {
    this.isAddModalOpen = true;
  }

  closeAddModal() {
    this.isAddModalOpen = false;
  }
}
