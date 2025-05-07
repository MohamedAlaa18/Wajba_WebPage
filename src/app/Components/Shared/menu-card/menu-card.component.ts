import { Component, Input } from '@angular/core';
import { ICategoryItem } from '../../../Models/category-item';

@Component({
  selector: 'app-menu-card',
  standalone: true,
  imports: [],
  templateUrl: './menu-card.component.html',
  styleUrl: './menu-card.component.scss'
})
export class MenuCardComponent {
  @Input() menuItem!: ICategoryItem;
}
