import { Component, OnInit } from '@angular/core';
import { CarouselComponent } from '../../Components/Shared/carousel/carousel.component';
import { OrderTypeModalComponent } from '../../Components/OrderType/order-type-modal/order-type-modal.component';

@Component({
  selector: 'app-order-type',
  standalone: true,
  imports: [CarouselComponent, OrderTypeModalComponent],
  templateUrl: './order-type.component.html',
  styleUrl: './order-type.component.scss'
})
export class OrderTypeComponent implements OnInit {
  // carouselImages = ["assets/images/burger_2.jpeg", "assets/images/meat_2.jpeg", "assets/images/sushi.jpeg", "assets/images/burger_2.jpeg", "assets/images/meat_2.jpeg"];
  carouselImages = ["assets/images/meat_2.jpeg", "assets/images/sushi.jpeg", "assets/images/burger_2.jpeg"];

  selectedMenu = "topRated";

  isModalOpen = false;

  ngOnInit(): void {
    this.openModal();
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

}
