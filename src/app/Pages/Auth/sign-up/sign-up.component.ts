import { Component, } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../Services/User/user.service';
import { IUser } from '../../../Models/user';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../Services/Snackbar/snackbar.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [TranslateModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  signUpForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isCountryCodeDropdownOpen = false;
  userAddress: string | null = null;

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
    private snackbarService: SnackbarService
  ) {
    this.signUpForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      countryCode: [this.countries[0].dial_code, Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      // password: ['', [Validators.required, Validators.minLength(6)]],
      // confirmPassword: ['', Validators.required],
    }, {
      //  validator: this.passwordMatchValidator
    });
  }

  togglePasswordVisibility(type: 'password' | 'confirmPassword'): void {
    if (type === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  // passwordMatchValidator(form: FormGroup): { mismatch: true } | null {
  //   return form.controls['password'].value === form.controls['confirmPassword'].value ? null : { mismatch: true };
  // }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      this.register();
    } else {
      this.signUpForm.markAllAsTouched();
      this.snackbarService.showMessage('Please fill in all required fields correctly.', true);
    }
  }

  isArabic(): boolean {
    return localStorage?.getItem('selectedLanguage') === 'ar';
  }

  toggleCountryCodeDropdown(): void {
    this.isCountryCodeDropdownOpen = !this.isCountryCodeDropdownOpen;
  }

  selectCountryCode(country: { code: string; dial_code: string; logo: string }): void {
    this.selectedCountryLogo = country.logo;
    this.selectedCountryDialCode = country.dial_code;
    this.signUpForm.controls['countryCode'].setValue(country.dial_code);
    this.isCountryCodeDropdownOpen = false;
  }

  register(): void {
    const user: IUser = {
      phoneNumber: this.signUpForm.controls['phone'].value,
      // fullName: `${this.signUpForm.controls['firstName'].value} ${this.signUpForm.controls['lastName'].value}`,
      fullName: `${this.signUpForm.controls['firstName'].value}`,
      email: this.signUpForm.controls['email'].value,
      phone: this.signUpForm.controls['phone'].value,
      // password: this.signUpForm.controls['password'].value,
      // confirmPassword: this.signUpForm.controls['confirmPassword'].value,
    };

    this.userData.register(user).subscribe(
      response => {
        console.log(response);
        if (response.success) {
          this.router.navigate(['/otp'], { queryParams: { phone: user.phone } });
          this.snackbarService.showMessage('Registration successful! Please verify your email.');
        } else {
          this.handleRegistrationError(response.message, user.phone);
        }
      },
      error => {
        console.error('Registration failed:', error);
        this.snackbarService.showMessage('Registration failed. Please try again later.', true);
      }
    );
  }

  handleRegistrationError(message: string, phone: string): void {
    if (message === 'User with this email already exists.') {
      // this.triggerPasswordReset(phone);
      this.snackbarService.showMessage('User with this email already exists.', true);
    } else {
      console.error('Error:', message);
      this.snackbarService.showMessage('Error: ' + message, true);
    }
  }

  // triggerPasswordReset(phone: string): void {
  //   this.userData.sendOTP(phone).subscribe(
  //     response => {
  //       console.log('Password reset OTP sent successfully', response);
  //       this.router.navigate(['/otp'], { queryParams: { phone } });
  //       this.snackbarService.showMessage('OTP sent! Please check your email.');
  //     },
  //     error => {
  //       console.error('Failed to send password reset OTP', error);
  //       this.snackbarService.showMessage('Failed to send OTP. Please try again later.', true);
  //     }
  //   );
  // }
}
