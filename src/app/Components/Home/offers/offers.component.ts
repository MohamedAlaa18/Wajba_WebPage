import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent {
  constructor(private router: Router) { }

  isOffersRoute(): boolean {
    return this.router.url === '/offers';
  }
}
