import { Component, OnInit } from '@angular/core';
import { IProductItem } from '../../../Models/product-item';
import { PopularCardComponent } from '../../Shared/popular-card/popular-card.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-popular-items',
  standalone: true,
  imports: [PopularCardComponent, TranslateModule],
  templateUrl: './popular-items.component.html',
  styleUrl: './popular-items.component.scss'
})
export class PopularItemsComponent implements OnInit {
  product!: IProductItem[];

  ngOnInit(): void {
    this.loadStaticPopularItems();
  }

  loadStaticPopularItems() {
    this.product = [
      {
        id: 1,
        name: 'Cheeseburger Deluxe',
        imageUrl: 'assets/images/cheeseburger.jpg',
        description: 'Double beef patty, melted cheese, pickles and onions.',
        price: 10.99,
        categoryId: 1,
        quantity: 20,
        attributes: [
          {
            attributeName: 'Bun Type',
            variations: [
              { id: 1, itemattributesId: 1, name: 'Sesame', additionalPrice: 0, note: '' },
              { id: 2, itemattributesId: 1, name: 'Brioche', additionalPrice: 1.5, note: '' }
            ]
          }
        ],
        itemAddons: [
          { itemId: 1, name: 'Extra Patty', price: 3.0 },
          { itemId: 1, name: 'Jalapeños', price: 0.5 }
        ],
        itemExtras: [
          { id: 1, itemId: 1, name: 'Curly Fries', originalPrice: 3.5, additionalPrice: 3.5, status: 1 }
        ]
      },
      {
        id: 2,
        name: 'BBQ Chicken Pizza',
        imageUrl: 'assets/images/bbq-pizza.jpg',
        description: 'Smoky BBQ sauce, grilled chicken, onions, and mozzarella.',
        price: 13.49,
        categoryId: 2,
        quantity: 15,
        attributes: [],
        itemAddons: [],
        itemExtras: []
      },
      {
        id: 3,
        name: 'Spicy Chicken Sandwich',
        imageUrl: 'assets/images/spicy-chicken.jpg',
        description: 'Crispy chicken fillet with spicy mayo and lettuce.',
        price: 9.25,
        categoryId: 1,
        quantity: 18,
        attributes: [],
        itemAddons: [
          { itemId: 3, name: 'Pepper Jack Cheese', price: 1.0 }
        ],
        itemExtras: [
          { id: 2, itemId: 3, name: 'Waffle Fries', originalPrice: 3.0, additionalPrice: 3.0, status: 1 }
        ]
      },
      {
        id: 4,
        name: 'Hawaiian Pizza',
        imageUrl: 'assets/images/hawaiian-pizza.jpg',
        description: 'Ham, pineapple, and cheese on a tomato base.',
        price: 12.75,
        categoryId: 2,
        quantity: 12,
        attributes: [],
        itemAddons: [],
        itemExtras: []
      },
      {
        id: 5,
        name: 'Strawberry Milkshake',
        imageUrl: 'assets/images/strawberry-shake.jpg',
        description: 'Creamy milkshake made with fresh strawberries.',
        price: 4.25,
        categoryId: 3,
        quantity: 30,
        attributes: [],
        itemAddons: [],
        itemExtras: []
      },
      // {
      //   id: 6,
      //   name: 'Onion Rings',
      //   imageUrl: 'assets/images/onion-rings.jpg',
      //   description: 'Crispy battered onion rings served with dipping sauce.',
      //   price: 3.75,
      //   categoryId: 3,
      //   quantity: 40,
      //   attributes: [],
      //   itemAddons: [],
      //   itemExtras: []
      // }
    ];
  }
}
