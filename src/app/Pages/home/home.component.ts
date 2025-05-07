import { Component } from '@angular/core';
import { HeroComponent } from '../../Components/Home/hero/hero.component';
import { OffersComponent } from "../../Components/Home/offers/offers.component";
import { PopularItemsComponent } from "../../Components/Home/popular-items/popular-items.component";
import { MenuComponent } from '../../Components/Home/menu/menu.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, MenuComponent, OffersComponent, PopularItemsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  // selectedCategory = "topRated";

  // onCategorySelected(category: string) {
  //   this.selectedCategory = category;
  // }
}
