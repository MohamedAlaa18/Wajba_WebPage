import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BranchService } from '../../../Services/Branch/branch.service';
import { IBranch } from '../../../Models/branch';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dine-in-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './dine-in-form.component.html',
  styleUrls: ['./dine-in-form.component.scss']
})
export class DineInFormComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();

  times = ['16:00', '17:00', '18:00', '19:00'];
  branches: IBranch[] = [];
  bookingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private branchService: BranchService
  ) {
    this.bookingForm = this.fb.group({
      date: [, Validators.required],
      persons: [, [Validators.required, Validators.min(1)]],
      branch: ['', Validators.required],
      time: ['', Validators.required],
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/)]],
      note: ['']
    });
  }

  ngOnInit(): void {
    this.getBranches();
  }

  getBranches() {
    const restaurantId = 1;
    this.branchService.getBranchByRestaurantId(restaurantId).subscribe({
      next: (response) => {
        this.branches = response.data;
      },
      error: (error) => {
        console.error('Failed to fetch branches', error);
      }
    });
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  onSubmit() {
    if (this.bookingForm.valid) {

      const bookingData = {
        ...this.bookingForm.value,
        type: 'dine-in'
      };

      console.log('Booking data submitted:', bookingData);
      localStorage.setItem('bookingData', JSON.stringify(bookingData));

      this.closeModal.emit();
    } else {
      console.error('Form is not valid');
      this.bookingForm.markAllAsTouched();
    }
  }
}
