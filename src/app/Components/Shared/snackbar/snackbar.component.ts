import { Component, OnInit } from '@angular/core';
import { SnackbarService } from '../../../Services/Snackbar/snackbar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {
  message: string = '';
  isVisible: boolean = false;
  isError: boolean = false;

  constructor(private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.snackbarService.setSnackbarComponent(this);
  }

  public showMessage(message: string, isError: boolean = false) {
    this.message = message;
    this.isError = isError;
    this.isVisible = true;
    setTimeout(() => {
      this.isVisible = false;
    }, 3000);
  }
}
