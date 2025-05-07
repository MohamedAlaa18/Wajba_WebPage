import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuCardComponent } from "../../Shared/menu-card/menu-card.component";
import { ICategoryItem } from '../../../Models/category-item';
import { TranslateModule } from '@ngx-translate/core';
import { IProductItem } from '../../../Models/product-item';
import { ProductCardComponent } from '../../Shared/product-card/product-card.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, TranslateModule, ProductCardComponent],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  selectedCategoryId!: number;
  categories: ICategoryItem[] = [];
  products: IProductItem[] = [];
  allProducts: IProductItem[] = [];

  ngOnInit(): void {
    this.loadStaticData();
  }

  loadStaticData(): void {
    // Static Categories
    this.categories = [
      { id: 1, name: 'Burgers', imageUrl: 'assets/images/burgers.jpg' },
      { id: 2, name: 'Pizzas', imageUrl: 'assets/images/pizzas.jpg' },
      { id: 3, name: 'Drinks', imageUrl: 'assets/images/drinks.jpg' },
    ];

    // Static Products
    this.allProducts = [
      {
        id: 101,
        name: 'Classic Burger',
        imageUrl: 'assets/images/burger.jpeg',
        description: 'Juicy beef burger with lettuce, tomato, and cheese.',
        price: 9.99,
        categoryId: 1,
        quantity: 10,
        attributes: [
          {
            attributeName: 'Size',
            variations: [
              { id: 1, itemattributesId: 101, name: 'Small', additionalPrice: 0, note: '' },
              { id: 2, itemattributesId: 101, name: 'Large', additionalPrice: 2, note: '' }
            ]
          }
        ],
        itemAddons: [
          { itemId: 101, name: 'Extra Cheese', price: 1.5 },
          { itemId: 101, name: 'Bacon', price: 2.0 }
        ],
        itemExtras: [
          { id: 1, itemId: 101, name: 'Fries', additionalPrice: 3, originalPrice: 3, status: 1 }
        ]
      },
      {
        id: 102,
        name: 'Pepperoni Pizza',
        imageUrl: 'assets/images/pepperoni-pizza.jpg',
        description: 'Cheesy pizza topped with pepperoni slices.',
        price: 12.5,
        categoryId: 2,
        quantity: 15,
        attributes: [],
        itemAddons: [],
        itemExtras: []
      },
      {
        id: 103,
        name: 'Coca Cola',
        imageUrl: 'assets/images/coca-cola.jpg',
        description: 'Chilled Coca Cola can 330ml.',
        price: 1.99,
        categoryId: 3,
        quantity: 50,
        attributes: [],
        itemAddons: [],
        itemExtras: []
      },
      {
        id: 104,
        name: 'Veggie Wrap',
        imageUrl: 'assets/images/burger_2.jpeg',
        description: 'Fresh veggies wrapped in soft tortilla.',
        price: 7.5,
        categoryId: 1,
        quantity: 20,
        attributes: [],
        itemAddons: [],
        itemExtras: []
      },
      {
        id: 105,
        name: 'Spaghetti Bolognese',
        imageUrl: 'assets/images/spaghetti.jpg',
        description: 'Classic Italian pasta with meat sauce.',
        price: 11.5,
        categoryId: 2,
        quantity: 12,
        attributes: [],
        itemAddons: [],
        itemExtras: []
      },
      {
        id: 106,
        name: 'Grilled Chicken Salad',
        imageUrl: 'assets/images/burger.jpeg',
        description: 'Healthy salad with grilled chicken strips.',
        price: 8.75,
        categoryId: 1,
        quantity: 18,
        attributes: [],
        itemAddons: [],
        itemExtras: []
      },
      {
        id: 107,
        name: 'Garlic Bread',
        imageUrl: 'assets/images/garlic-bread.jpg',
        description: 'Toasted bread with garlic and butter.',
        price: 3.99,
        categoryId: 2,
        quantity: 25,
        attributes: [],
        itemAddons: [],
        itemExtras: []
      },
      {
        id: 108,
        name: 'Chocolate Milkshake',
        imageUrl: 'assets/images/chocolate-milkshake.jpg',
        description: 'Rich and creamy chocolate shake.',
        price: 4.5,
        categoryId: 3,
        quantity: 30,
        attributes: [],
        itemAddons: [],
        itemExtras: []
      },
      {
        id: 109,
        name: 'Vanilla Ice Cream',
        imageUrl: 'assets/images/vanilla-ice-cream.jpg',
        description: 'Classic vanilla ice cream scoop.',
        price: 2.99,
        categoryId: 3,
        quantity: 40,
        attributes: [],
        itemAddons: [],
        itemExtras: []
      },
      {
        id: 110,
        name: 'BBQ Chicken Wings',
        imageUrl: 'assets/images/burger_2.jpeg',
        description: 'Tender wings glazed with BBQ sauce.',
        price: 6.75,
        categoryId: 1,
        quantity: 22,
        attributes: [],
        itemAddons: [],
        itemExtras: []
      },
      {
        id: 111,
        name: 'Margherita Pizza',
        imageUrl: 'assets/images/margherita-pizza.jpg',
        description: 'Tomato, mozzarella, and basil pizza.',
        price: 10.99,
        categoryId: 2,
        quantity: 17,
        attributes: [],
        itemAddons: [],
        itemExtras: []
      },
      {
        id: 112,
        name: 'Sprite',
        imageUrl: 'assets/images/sprite.jpg',
        description: 'Refreshing lemon-lime soda.',
        price: 1.89,
        categoryId: 3,
        quantity: 60,
        attributes: [],
        itemAddons: [],
        itemExtras: []
      },
      {
        id: 113,
        name: 'Chicken Tenders',
        imageUrl: 'assets/images/burger.jpeg',
        description: 'Crispy fried chicken strips.',
        price: 5.99,
        categoryId: 1,
        quantity: 35,
        attributes: [],
        itemAddons: [],
        itemExtras: []
      },
      {
        id: 114,
        name: 'Taco Supreme',
        imageUrl: 'assets/images/burger_2.jpeg',
        description: 'Beef taco with lettuce, cheese, and salsa.',
        price: 3.5,
        categoryId: 1,
        quantity: 25,
        attributes: [],
        itemAddons: [],
        itemExtras: []
      },
      {
        id: 115,
        name: 'Fettuccine Alfredo',
        imageUrl: 'assets/images/alfredo.jpg',
        description: 'Creamy pasta with parmesan sauce.',
        price: 12.99,
        categoryId: 2,
        quantity: 14,
        attributes: [],
        itemAddons: [],
        itemExtras: []
      },
      {
        id: 116,
        name: 'Lemonade',
        imageUrl: 'assets/images/lemonade.jpg',
        description: 'Freshly squeezed lemonade.',
        price: 2.25,
        categoryId: 3,
        quantity: 50,
        attributes: [],
        itemAddons: [],
        itemExtras: []
      },
      {
        id: 117,
        name: 'Mozzarella Sticks',
        imageUrl: 'assets/images/burger.jpeg',
        description: 'Fried mozzarella sticks with marinara.',
        price: 4.25,
        categoryId: 1,
        quantity: 20,
        attributes: [],
        itemAddons: [],
        itemExtras: []
      },
      {
        id: 118,
        name: 'Mango Smoothie',
        imageUrl: 'assets/images/mango-smoothie.jpg',
        description: 'Sweet mango smoothie with yogurt.',
        price: 4.75,
        categoryId: 3,
        quantity: 28,
        attributes: [],
        itemAddons: [],
        itemExtras: []
      }
    ];

    if (this.categories.length > 0) {
      this.selectCategory(this.categories[0].id);
    }
  }

  selectCategory(categoryId: number) {
    this.selectedCategoryId = categoryId;
    this.products = this.allProducts.filter(p => p.categoryId === categoryId);
  }
}


// getAllCategories() {
//   this.categoryService.getAllCategories().subscribe(response => {
//     this.categories = response.data;
//     // console.log(response);

//     if (this.categories.length > 0) {
//       this.selectCategory(this.categories[0].id);
//     }
//   });
// }

// getItemsByCategory(categoryId: number) {
//   this.productService.getItemsByCategory(categoryId).subscribe(response => {
//     this.products = response.nonFeaturedItems;
//     // console.log(response);
//   });
// }

// selectCategory(categoryId: number) {
//   this.selectedCategoryId = categoryId;
//   this.getItemsByCategory(categoryId);
// }
