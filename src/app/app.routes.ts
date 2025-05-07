import { Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { LoginComponent } from './Pages/Auth/login/login.component';
import { SignUpComponent } from './Pages/Auth/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './Pages/Auth/forgot-password/forgot-password.component';
import { OTPComponent } from './Pages/Auth/otp/otp.component';
import { OrderTypeComponent } from './Pages/order-type/order-type.component';
import { ResetPasswordComponent } from './Pages/Auth/reset-password/reset-password.component';
import { CheckoutComponent } from './Pages/Order/checkout/checkout.component';
import { NewCardComponent } from './Pages/Order/new-card/new-card.component';
import { OffersComponent } from './Components/Home/offers/offers.component';
import { OrderTypeRedirectGuard } from './Guards/Guards/order-type-redirect.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, data: { title: 'Eat happy' }, canActivate: [OrderTypeRedirectGuard] },
  { path: 'login', component: LoginComponent, data: { title: 'Login' } },
  { path: 'signup', component: SignUpComponent, data: { title: 'SignUp' } },
  { path: 'forgotPassword', component: ForgotPasswordComponent, data: { title: 'Forgot Password' } },
  { path: 'changePassword', component: ResetPasswordComponent, data: { title: 'Change Password' } },
  { path: 'otp', component: OTPComponent, data: { title: 'OTP Verification' } },
  { path: 'orderType', component: OrderTypeComponent, data: { title: 'Order Type' } },
  { path: 'checkout', component: CheckoutComponent, data: { title: 'checkout' }, canActivate: [OrderTypeRedirectGuard] },
  { path: 'newCard', component: NewCardComponent, data: { title: 'New Card' }, canActivate: [OrderTypeRedirectGuard] },
  { path: 'offers', component: OffersComponent, data: { title: 'Offers' }, canActivate: [OrderTypeRedirectGuard] }
];
