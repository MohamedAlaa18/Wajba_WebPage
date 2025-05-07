import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../Services/User/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../../Services/Snackbar/snackbar.service';
import { NavigationService } from '../../../Services/Navigation/navigation.service';
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';
import { JwtService } from '../../../Services/Jwt/jwt.service';
import { CartService } from '../../../Services/Cart/cart.service';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OTPComponent implements OnInit {
  otpForm: FormGroup;
  otpControls = ['digit0', 'digit1', 'digit2', 'digit3', 'digit4', 'digit5'];
  phone!: string;

  constructor(
    private fb: FormBuilder,
    private userData: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbarService: SnackbarService,
    private navigationService: NavigationService,
    private afterActionService: AfterActionService,
    private jwtService: JwtService,
    private cartService: CartService,
  ) {
    this.otpForm = this.fb.group({
      digit0: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit1: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit2: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit3: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit4: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit5: ['', [Validators.required, Validators.pattern('[0-9]')]],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.phone = params['phone'];
    });

    // Use setTimeout to ensure the previous URL is captured after initialization
    setTimeout(() => {
      const previousUrl = this.navigationService.getPreviousUrl();
      console.log("previousUrl: " + previousUrl);
    }, 0);
  }

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (event instanceof ClipboardEvent) {
      const pastedData = event.clipboardData?.getData('text') || '';
      if (pastedData.length === this.otpControls.length) {
        this.otpControls.forEach((control, i) => {
          this.otpForm.get(control)?.setValue(pastedData[i]);
        });
      } else {
        input.value = pastedData[0] || '';
        if (pastedData.length > 1 && index < this.otpControls.length - 1) {
          this.otpControls.slice(index + 1).forEach((control, i) => {
            this.otpForm.get(control)?.setValue(pastedData[i + 1] || '');
          });
        }
      }
    } else {
      if (value.length === 1 && index < this.otpControls.length - 1) {
        const nextInput = document.querySelector(`input[formControlName='digit${index + 1}']`) as HTMLElement;
        nextInput.focus();
      }
    }
  }

  onSubmit() {
    if (this.otpForm.valid) {
      const otp = this.otpControls.map(control => this.otpForm.get(control)?.value).join('');
      this.verifyOTP(otp);
    } else {
      this.otpForm.markAllAsTouched();
      this.snackbarService.showMessage('Please enter a valid OTP.', true);
    }
  }

  verifyOTP(otp: string) {
    if (this.phone) {
      const otpData = {
        phone: this.phone,
        otp: otp
      };
      console.log(otpData);
      this.userData.verifyOTP(otpData).subscribe(
        response => {
          console.log(response);
          if (response.success) {
            if (response.token) {
              this.jwtService.setToken(response.token);
            }

            this.snackbarService.showMessage('OTP verification successful!');
            const previousUrl = this.navigationService.getPreviousUrl();
            console.log(previousUrl);

            if (previousUrl === '/signup') {
              this.router.navigate(['/login']);
            } else if (previousUrl === '/login' || previousUrl?.includes('/otp?phone=')) {
              this.login();
            } else if (previousUrl === '/forgotPassword') {
              this.router.navigate(['/changePassword'], { queryParams: { phone: this.phone } });
            } else {
              this.router.navigate(['/']);
            }
          } else {
            this.snackbarService.showMessage('OTP verification failed. Please try again.', true);
          }
        },
        error => {
          this.snackbarService.showMessage('OTP verification failed. Please try again.', true);
        }
      );
    } else {
      this.snackbarService.showMessage('Email is missing. Please try again.', true);
    }
  }

  login() {
    const user = {
      phone: this.phone,
    };

    this.userData.login(user).subscribe(
      (response) => {
        if (response.success) {
          console.log(response);

          const savedItem = localStorage.getItem('cartItem');
          console.log(savedItem)
          if (savedItem) {
            const item = JSON.parse(savedItem);

            this.cartService.addItemToCart(item).subscribe(
              (cartResponse) => {
                if (cartResponse.success) {
                  console.log('Item added to cart from local storage:', cartResponse);

                  localStorage.removeItem('cartItem');
                } else {
                  console.error('Failed to add item to cart:', cartResponse);
                }
              },
              (cartError) => {
                console.error('Error adding item to cart from local storage:', cartError);
              }
            );
          }

          this.router.navigate(['/']);

          setTimeout(() => {
            this.afterActionService.reloadCurrentRoute();
            this.snackbarService.showMessage('Login successful!');
          }, 100);
        } else {
          this.handleLoginError(response.message);
        }
      },
      (error) => {
        this.handleLoginError(error.error.message);
      }
    );
  }

  handleLoginError(message: string) {
    const verificationMessage = 'needs to verify their account first';
    if (message.includes(verificationMessage)) {
      const phoneMatch = message.match(/Customer with phone ([^ ]+)/);
      const phone = phoneMatch ? phoneMatch[1] : this.phone;
      this.triggerResendOTP(phone);
      this.snackbarService.showMessage('Please verify your account first.', true);
    } else {
      this.snackbarService.showMessage('Login failed: ' + message, true);
    }
  }

  triggerResendOTP(phone: string) {
    this.userData.sendOTP(phone).subscribe(
      response => {
        this.snackbarService.showMessage('OTP sent successfully. Please check your phone.');
        this.router.navigate(['/otp'], { queryParams: { phone: phone } });
      },
      error => {
        this.snackbarService.showMessage('Failed to send OTP. Please try again later.', true);
      }
    );
  }
}
