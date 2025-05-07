import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../Services/User/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../../Services/Snackbar/snackbar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [TranslateModule, ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  email: string | null = null;
  showPassword = false;
  showConfirmPassword = false;
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
    private userService: UserService,
    private router: Router,
    private snackbarService: SnackbarService,
    private route: ActivatedRoute,
  ) {
    this.changePasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required],
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
  }

  togglePasswordVisibility(type: 'newPassword' | 'confirmNewPassword'): void {
    if (type === 'newPassword') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  passwordMatchValidator(form: FormGroup): { mismatch: true } | null {
    return form.controls['newPassword'].value === form.controls['confirmNewPassword'].value ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.changePasswordForm.valid && this.email) {
      const newPassword = this.changePasswordForm.controls['newPassword'].value;
      const confirmNewPassword = this.changePasswordForm.controls['confirmNewPassword'].value;
      const passwordData = {
        email: this.email,
        newPassword: newPassword,
        confirmPassword: confirmNewPassword
      };

      console.log('Sending password reset data:', passwordData);

      this.userService.resetPassword(passwordData).subscribe(
        response => {
          this.snackbarService.showMessage('Password reset successful!');
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Password reset failed:', error);
          this.snackbarService.showMessage('Password reset failed. Please try again.', true);
        }
      );
    } else {
      this.snackbarService.showMessage('Please fill out the form correctly.', true);
      this.changePasswordForm.markAllAsTouched();
    }
  }

  isArabic(): boolean {
    return localStorage?.getItem('selectedLanguage') === 'ar';
  }

  toggleCountryCodeDropdown(): void {
    this.isCountryCodeDropdownOpen = !this.isCountryCodeDropdownOpen;
  }

  handleRegistrationError(message: string, email: string): void {
    if (message === 'User with this email already exists.') {
      this.triggerPasswordReset(email);
      this.snackbarService.showMessage('User with this email already exists.', true);
    } else {
      console.error('Error:', message);
      this.snackbarService.showMessage('Error: ' + message, true);
    }
  }

  triggerPasswordReset(email: string): void {
    this.userService.sendOTP(email).subscribe(
      response => {
        console.log('Password reset OTP sent successfully', response);
        this.router.navigate(['/otp'], { queryParams: { email } });
        this.snackbarService.showMessage('OTP sent! Please check your email.');
      },
      error => {
        console.error('Failed to send password reset OTP', error);
        this.snackbarService.showMessage('Failed to send OTP. Please try again later.', true);
      }
    );
  }
}
