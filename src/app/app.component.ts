import { Component, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from "./Components/Shared/header/header.component";
import { FooterComponent } from "./Components/Shared/footer/footer.component";
import { CartComponent } from "./Components/Cart/cart/cart.component";
import { SnackbarComponent } from './Components/Shared/snackbar/snackbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CartComponent, SnackbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'food-ordering-system';

  constructor(private renderer: Renderer2, private translateService: TranslateService) { }

  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
      this.changeDirection(savedLanguage);

      this.translateService.onLangChange.subscribe((event: any) => {
        this.changeDirection(event.lang);
      });
    }
  }

  changeDirection(lang: string) {
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    this.renderer.setAttribute(document.documentElement, 'dir', direction);
  }
}
