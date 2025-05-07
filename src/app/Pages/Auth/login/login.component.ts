import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../Services/User/user.service';
import { Router, RouterModule } from '@angular/router';
import { SnackbarService } from '../../../Services/Snackbar/snackbar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [TranslateModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  isCountryCodeDropdownOpen = false;

  countries = [
    { name: 'Qatar', code: 'QA', dial_code: '+974', logo: 'assets/images/qatar.png' },
    { name: 'United States', code: 'US', dial_code: '+1', logo: 'assets/images/usa.png' },
    { name: 'United Kingdom', code: 'GB', dial_code: '+44', logo: 'assets/images/uk.png' },
  ];

  selectedCountryLogo = this.countries[0].logo;
  selectedCountryDialCode = this.countries[0].dial_code;

  constructor(
    private fb: FormBuilder,
    private userData: UserService,
    private router: Router,
    private snackbarService: SnackbarService,
  ) {
    this.loginForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/)]],
      countryCode: [this.countries[0].dial_code]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.sendOTP();
    } else {
      this.loginForm.markAllAsTouched();
      this.snackbarService.showMessage('Please fill in all required fields correctly.', true);
    }
  }

  isArabic() {
    return typeof window !== 'undefined' && localStorage?.getItem('selectedLanguage') === 'ar';
  }

  sendOTP() {
    const phone = this.selectedCountryDialCode + this.loginForm.controls['phone'].value;

    this.userData.sendOTP(phone).subscribe(
      response => {
        if (response.success) {
          this.router.navigate(['/otp'], { queryParams: { phone } });
        } else {
          this.snackbarService.showMessage(response.message, true);
        }
      },
      error => {
        this.snackbarService.showMessage(error.error.message, true);
      }
    );
  }

  onCountrySelect(event: Event) {
    const dialCode = (event.target as HTMLSelectElement).value;
    const selectedCountry = this.countries.find(country => country.dial_code === dialCode);

    if (selectedCountry) {
      this.selectedCountryLogo = selectedCountry.logo;
      this.selectedCountryDialCode = selectedCountry.dial_code;
    }
  }

  toggleCountryCodeDropdown(): void {
    this.isCountryCodeDropdownOpen = !this.isCountryCodeDropdownOpen;
  }

  // selectCountryCode(country: { code: string; dial_code: string; logo: string }): void {
  //   this.selectedCountryLogo = country.logo;
  //   this.selectedCountryDialCode = country.dial_code;
  //   this.loginForm.controls['countryCode'].setValue(country.dial_code);
  //   this.isCountryCodeDropdownOpen = false;
  // }

  selectCountryCode(country: { code: string; dial_code: string; logo: string }): void {
    this.selectedCountryLogo = country.logo;
    this.selectedCountryDialCode = country.dial_code;
    this.isCountryCodeDropdownOpen = false;
  }

}
