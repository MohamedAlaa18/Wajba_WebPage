import { Injectable } from '@angular/core';
import { SnackbarComponent } from '../../Components/Shared/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private snackbar: SnackbarComponent | null = null;

  public setSnackbarComponent(snackbar: SnackbarComponent) {
    this.snackbar = snackbar;
  }

  public showMessage(message: string, isError: boolean = false): void {
    if (this.snackbar) {
      this.snackbar.showMessage(message, isError);
    } else {
      console.warn('Snackbar component is not set.');
    }
  }
}
