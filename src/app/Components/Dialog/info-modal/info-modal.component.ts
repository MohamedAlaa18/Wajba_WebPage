import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IProductItem } from '../../../Models/product-item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-modal.component.html',
  styleUrl: './info-modal.component.scss'
})
export class InfoModalComponent {
  @Input() isModalOpen: boolean = false;
  @Input() productItem!: IProductItem;

  @Output() closeModalEvent = new EventEmitter<void>();

  closeModal() {
    this.closeModalEvent.emit();
  }
}
