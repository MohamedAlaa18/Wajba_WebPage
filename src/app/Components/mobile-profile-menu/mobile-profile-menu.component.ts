import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IUser } from '../../Models/user';

@Component({
  selector: 'app-mobile-profile-menu',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './mobile-profile-menu.component.html',
  styleUrls: ['./mobile-profile-menu.component.scss']
})
export class MobileProfileMenuComponent {
  @Input() profileMenuItems: any[] = [];
  @Input() selectedBranch: string = '';
  @Input() showBranches: boolean = false;
  @Input() isProfileMobileDropdownOpen: boolean = false;
  @Input() restaurant: any;
  @Input() user!: IUser;
  @Input() token: string | null = null;
  @Input() languages: { code: string, imgSrc: string, alt: string, label: string }[] = [];

  @Output() toggleProfileMobileDropdown = new EventEmitter<boolean>();
  @Output() toggleBranches = new EventEmitter<void>();
  @Output() selectBranch = new EventEmitter<string>();
  @Output() logout = new EventEmitter<void>();
  @Output() changeLanguage = new EventEmitter<{ event: any, language: string, image: string, name: string }>();

  isLanguageDropdownOpen: boolean = false;
  selectedLanguage: string = 'English';
  selectedLanguageImage: string = 'assets/images/english.svg';

  // Language modal visibility state
  showLanguageModal: boolean = false;

  profileMenuItems_noLog = [
    { icon: 'Login', label: 'general.login', href: '/login' },
    { icon: 'change_language', label: 'general.change_language' },
    { icon: 'address', label: 'general.address', href: '#' },
  ];

  onToggleProfileMobileDropdown() {
    this.toggleProfileMobileDropdown.emit(this.isProfileMobileDropdownOpen);
  }

  onToggleBranches() {
    this.toggleBranches.emit();
  }

  onSelectBranch(branch: string) {
    this.selectBranch.emit(branch);
  }

  onLogout() {
    this.logout.emit();
  }

  toggleLanguageDropdown() {
    this.isLanguageDropdownOpen = !this.isLanguageDropdownOpen;
  }

  // Open the language modal
  openLanguageModal() {
    this.showLanguageModal = true;
  }

  // Close the language modal
  onCloseLanguageModal(event: MouseEvent) {
    event.stopPropagation();
    this.showLanguageModal = false;
  }

  // Change language and close modal
  onChangeLanguage(event: any, language: string, image: string, name: string) {
    this.changeLanguage.emit({ event, language, image, name });
  }

  trackByIndex(index: number): number {
    return index;
  }

  handleClick(icon: string): void {
    switch (icon) {
      case 'logout':
        this.onLogout();
        break;
      case 'change_language':
        this.openLanguageModal();
        break;
      default:
        break;
    }
  }
}
