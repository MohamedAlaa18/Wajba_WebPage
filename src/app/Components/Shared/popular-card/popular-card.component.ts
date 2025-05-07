import { Component, Input } from '@angular/core';
import { IProductItem } from '../../../Models/product-item';
import { InfoModalComponent } from "../../Dialog/info-modal/info-modal.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popular-card',
  standalone: true,
  imports: [InfoModalComponent,CommonModule],
  templateUrl: './popular-card.component.html',
  styleUrl: './popular-card.component.scss'
})
export class PopularCardComponent {
  modalData = {
    header: 'Salmon With Mix Vegetables',
    body: ' LMIV - Allergen - i). Contains fish and products thereof. ii). Contains sulphur dioxide and sulphites. iii). Contains soybeans and products thereof. iv). Contains milk and products thereof (including lactose). v).'
  }
  @Input() productItem!: IProductItem;

  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
