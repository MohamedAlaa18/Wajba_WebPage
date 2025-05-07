import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../Services/User/user.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../Services/Snackbar/snackbar.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isCountryCodeDropdownOpen = false;

  countries = [
    { name: 'Qatar', code: 'QA', dial_code: '+974', logo: 'assets/images/qatar.png' },
    { name: 'United States', code: 'US', dial_code: '+1', logo: '' },
    { name: 'United Kingdom', code: 'GB', dial_code: '+44', logo: '' },
  ];
  selectedCountryLogo = this.countries[0].logo;
  selectedCountryDialCode = this.countries[0].dial_code;

  constructor(
    private fb: FormBuilder,
    private userData: UserService,
    private router: Router,
    private snackbarService: SnackbarService,
  ) {
    this.forgotPasswordForm = this.fb.group({
      countryCode: [''],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  toggleCountryCodeDropdown() {
    this.isCountryCodeDropdownOpen = !this.isCountryCodeDropdownOpen;
  }

  selectCountryCode(country: { code: string; dial_code: string; logo: string }) {
    this.selectedCountryLogo = country.logo;
    this.selectedCountryDialCode = country.dial_code;
    this.forgotPasswordForm.controls['countryCode'].setValue(country.code);
    this.isCountryCodeDropdownOpen = false;
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.controls['email'].value;

      // Step 1: Check if the email exists
      this.userData.checkCustomerEmail(email).subscribe({
        next: (response) => {
          console.log("response : " + response)
          if (response && response.success != null) {
            // Step 2: Check if the email is verified
            this.userData.checkIfVerified(email).subscribe({
              next: (verifyResponse) => {
                console.log("verifyResponse : " + verifyResponse)

                if (verifyResponse && verifyResponse.isVerified) {
                  // Email exists and is verified
                  console.log('Email is verified:', email);
                  this.router.navigate(['/changePassword'], { queryParams: { email } });
                } else {
                  // Email exists but is not verified
                  console.log('Email is not verified:', email);
                  this.snackbarService.showMessage('Email is not verified.', true);
                  this.sendOTP(email);
                  // Show an error message or prompt for verification
                }
              },
              error: (err) => {
                console.error('Error verifying email:', err);
                // Handle the error (e.g., show a notification)
              }
            });
          } else {
            // Email does not exist
            console.log('Email does not exist:', email);
            this.snackbarService.showMessage('Email does not exist.', true);
            // Show an error message or prompt to register
          }
        },
        error: (err) => {
          console.error('Error checking customer email:', err);
          this.snackbarService.showMessage('Error checking customer email.', true);
          // Handle the error (e.g., show a notification)
        }
      });
    } else {
      console.log('Form is not valid');
      this.forgotPasswordForm.markAllAsTouched();
    }
  }

  sendOTP(email: string) {
    this.userData.sendOTP(email).subscribe(
      response => {
        console.log('Password reset OTP sent successfully', response);
        this.router.navigate(['/otp'], { queryParams: { email } });
        this.snackbarService.showMessage('OTP sent! Please check your email.');
      },
      error => {
        console.error('Failed to send password reset OTP', error);
        this.snackbarService.showMessage('Failed to send OTP. Please try again later.', true);
      }
    )
  }
}
