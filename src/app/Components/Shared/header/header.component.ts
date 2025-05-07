import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CartService } from '../../../Services/Cart/cart.service';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { JwtService } from '../../../Services/Jwt/jwt.service';
import { IUser } from '../../../Models/user';
import { UserService } from '../../../Services/User/user.service';
import { BranchService } from '../../../Services/Branch/branch.service';
import { RestaurantService } from '../../../Services/Restaurant/restaurant.service';
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';
import { Subscription } from 'rxjs';
import { MobileProfileMenuComponent } from "../../mobile-profile-menu/mobile-profile-menu.component";
import { ICart } from '../../../Models/cart';
import { IBranch } from '../../../Models/branch';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslateModule, MobileProfileMenuComponent, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isOrderTypeRoute: boolean = false;
  showBranches: boolean = false;
  isBranchDropdownOpen = false;
  isLanguageDropdownOpen = false;
  isProfileDesktopDropdownOpen = false;
  isProfileMobileDropdownOpen = false;

  selectedBranch: string = 'doha';
  token: string | null = null;
  user!: IUser;
  tokenSubscription!: Subscription;
  cart!: ICart;
  storedBranch!: IBranch;
  branches: IBranch[] = [];
  restaurant: any;
  profileMenuItems: any[] = [];

  @ViewChild('branchDropdown', { static: false }) branchDropdown!: ElementRef;
  @ViewChild('languageDropdown', { static: false }) languageDropdown!: ElementRef;
  @ViewChild('profileDesktopDropdown', { static: false }) profileDesktopDropdown!: ElementRef;
  @ViewChild('profileMobileDropdown', { static: false }) profileMobileDropdown!: ElementRef;

  languages = [
    { code: 'en', imgSrc: '/assets/images/english.png', alt: 'English', label: 'general.english' },
    { code: 'ar', imgSrc: '/assets/images/arabic.png', alt: 'Arabic', label: 'general.arabic' },
    { code: 'bn', imgSrc: '/assets/images/bangla.png', alt: 'Bangla', label: 'general.bangla' }
  ];

  selectedLanguage: string = this.languages[0].label;
  selectedLanguageImage: string = this.languages[0].imgSrc;

  constructor(
    private translateService: TranslateService,
    private userService: UserService,
    private renderer: Renderer2,
    private cartData: CartService,
    private router: Router,
    private jwtService: JwtService,
    private branchService: BranchService,
    private restaurantService: RestaurantService,
    private afterActionService: AfterActionService,
    private cartService: CartService
  ) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedLanguage = localStorage.getItem('selectedLanguage');
      const savedLanguageImage = localStorage.getItem('selectedLanguageImage');
      const savedLanguageName = localStorage.getItem('selectedLanguageName');

      this.selectedLanguage = savedLanguageName || 'English';
      this.selectedLanguageImage = savedLanguageImage || '/assets/images/english.png';

      if (savedLanguage) {
        this.changeDirection(savedLanguage);
        this.translateService.use(localStorage.getItem('selectedLanguage') ?? '');
      }
    }
  }

  ngOnInit(): void {
    if (this.storedBranch) {
      // const parsedBranch = JSON.parse(this.storedBranch);
      this.selectedBranch = this.storedBranch.name;
    }

    this.tokenSubscription = this.jwtService.authToken$.subscribe(token => {
      this.token = token;
      this.updateUser();
    });

    this.getBranches();
    this.getRestaurant();
    this.updateProfileMenuItems();
    // this.loadCart();

    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('selectedBranch');
      if (stored) {
        this.storedBranch = JSON.parse(stored);
        this.selectedBranch = this.storedBranch.name;
      }
    }
  }

  private checkConditions() {
    let bookingData = null;

    if (typeof window !== 'undefined' && window.localStorage) {
      bookingData = localStorage.getItem('bookingData');
    }

    const noUserLoggedIn = !this.user || Object.keys(this.user).length === 0;

    if (!this.isOrderTypeRoute && noUserLoggedIn && !bookingData) {
      console.log('No user logged in, no bookingData, and not on the orderType route.');
      this.router.navigate(['/orderType']);
    }
  }

  ngOnDestroy(): void {
    if (this.tokenSubscription) {
      this.tokenSubscription.unsubscribe();
    }
  }

  loadCart(): void {
    // First check if the cart is already available in the service
    const savedCart = this.cartService.getSavedCart();
    if (savedCart) {
      this.cart = savedCart.data;
    } else {
      // If not, fetch it from the server
      this.cartService.getCart().subscribe(
        cart => {
          this.cart = cart.data;
          console.log(this.cart);
        },
        error => {
          console.error('Failed to load cart items', error);
        }
      );
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateProfileMenuItems();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.branchDropdown && !this.branchDropdown.nativeElement.contains(event.target)) {
      this.isBranchDropdownOpen = false;
    }

    if (this.languageDropdown && !this.languageDropdown.nativeElement.contains(event.target)) {
      this.isLanguageDropdownOpen = false;
    }

    if (this.profileDesktopDropdown && !this.profileDesktopDropdown.nativeElement.contains(event.target)) {
      this.isProfileDesktopDropdownOpen = false;
    }

    if (this.profileMobileDropdown && !this.profileMobileDropdown.nativeElement.contains(event.target)) {
      this.isProfileMobileDropdownOpen = false;
    }
  }

  toggleBranchDropdown() {
    this.isBranchDropdownOpen = !this.isBranchDropdownOpen;
    this.isLanguageDropdownOpen = false;
    this.isProfileDesktopDropdownOpen = false;
  }

  toggleLanguageDropdown() {
    this.isLanguageDropdownOpen = !this.isLanguageDropdownOpen;
    this.isBranchDropdownOpen = false;
    this.isProfileDesktopDropdownOpen = false;
  }

  toggleProfileDesktopDropdown() {
    this.isProfileDesktopDropdownOpen = !this.isProfileDesktopDropdownOpen;
    this.isBranchDropdownOpen = false;
    this.isLanguageDropdownOpen = false;
    this.isProfileMobileDropdownOpen = false;
  }

  toggleProfileMobileDropdown() {
    this.isProfileMobileDropdownOpen = !this.isProfileMobileDropdownOpen;
  }

  selectBranch(branch: any) {
    console.log(branch)
    this.selectedBranch = branch.name;

    // Save the entire branch object as a JSON string
    localStorage.setItem('selectedBranch', JSON.stringify(branch));
  }

  changeLanguage(event: any, language: string, image: string, name: string) {
    event.preventDefault();

    this.selectedLanguage = name;
    this.selectedLanguageImage = image;

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('selectedLanguage', language);
      localStorage.setItem('selectedLanguageImage', image);
      localStorage.setItem('selectedLanguageName', name);
    }

    this.changeDirection(language);
    this.translateService.use(localStorage.getItem('selectedLanguage') ?? language);
  }

  changeDirection(lang: string) {
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    this.renderer.setAttribute(document.documentElement, 'dir', direction);
  }

  openCart(): void {
    this.cartData.setCartIsOpen(true);
  }

  toggleBranches() {
    this.showBranches = !this.showBranches;
  }

  getBranches() {
    const restaurantId = 1;
    this.branchService.getBranchByRestaurantId(restaurantId).subscribe({
      next: (response) => {
        this.branches = response.data;
        console.log(response)

        if (!this.storedBranch) {
          console.log("this.storedBranch : " + this.storedBranch)
          this.selectBranch(this.branches[0]);
        }
      },
      error: (error) => {
        console.error('Failed to fetch branches', error);
      }
    });
  }

  getRestaurant() {
    const restaurantId = 1;
    this.restaurantService.getRestaurantById(restaurantId).subscribe({
      next: (response) => {
        this.restaurant = response;
        // console.log(response)
      },
      error: (error) => {
        console.error('Failed to fetch restaurant image', error);
      }
    });
  }

  private updateUser(): void {
    if (this.token) {
      const userId = this.jwtService.getUserIdFromToken(this.token);

      if (userId) {
        this.userService.getCustomerById(userId).subscribe({
          next: (data) => {
            this.user = data.data;
            console.log('User data:', data);
          },
          error: (error) => {
            console.error('Failed to fetch user data', error);
          }
        });
      }
    } else {
      this.user = {} as IUser;
    }
  }

  logout() {
    this.userService.logout().subscribe({
      next: () => {
        this.afterActionService.reloadCurrentRoute();
      },
      error: (error) => {
        console.error('Logout failed', error);
      }
    });
  }

  private updateProfileMenuItems() {
    if (typeof window === 'undefined') {
      // Provide a default or skip logic for SSR
      this.profileMenuItems = [
        { icon: 'order', label: 'general.my_orders', href: '#', src: "assets/images/order.svg" },
        { icon: 'edit', label: 'general.edit_profile', href: '#', src: "assets/images/edit-gray.svg" },
        { icon: 'chat', label: 'general.chat', href: '#', src: "assets/images/chat.svg" },
        { icon: 'address', label: 'general.address', href: '#', src: "assets/images/address.svg" },
        { icon: 'logout', label: 'general.logout', href: '#', src: "assets/images/logout.svg" }
      ];
      return;
    }

    const screenWidth = window.innerWidth;

    if (screenWidth < 767) {
      this.profileMenuItems = [
        { icon: 'order', label: 'general.my_orders', href: '#', src: "assets/images/order.svg" },
        { icon: 'edit', label: 'general.edit_profile', href: '#', src: "assets/images/edit-gray.svg" },
        { icon: 'chat', label: 'general.chat', href: '#', src: "assets/images/chat.svg" },
        { icon: 'address', label: 'general.address', href: '#', src: "assets/images/address.svg" },
        { icon: 'change_language', label: 'general.change_language', href: '#', src: "assets/images/change-language.svg" },
        { icon: 'logout', label: 'general.logout', href: '#', src: "assets/images/logout.svg" }
      ];
    } else {
      this.profileMenuItems = [
        { icon: 'order', label: 'general.my_orders', href: '#', src: "assets/images/order.svg" },
        { icon: 'edit', label: 'general.edit_profile', href: '#', src: "assets/images/edit-gray.svg" },
        { icon: 'chat', label: 'general.chat', href: '#', src: "assets/images/chat.svg" },
        { icon: 'address', label: 'general.address', href: '#', src: "assets/images/address.svg" },
        { icon: 'logout', label: 'general.logout', href: '#', src: "assets/images/logout.svg" }
      ];
    }
  }
}
