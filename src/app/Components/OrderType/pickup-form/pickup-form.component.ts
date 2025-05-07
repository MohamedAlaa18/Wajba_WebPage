import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BranchService } from '../../../Services/Branch/branch.service';
import { IBranch } from '../../../Models/branch';

@Component({
  selector: 'app-pickup-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './pickup-form.component.html',
  styleUrls: ['./pickup-form.component.scss']
})
export class PickupFormComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();

  times = ['16:00', '17:00', '18:00', '19:00']; // Array of time options
  branches: IBranch[] = [];
  bookingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private branchService: BranchService
  ) {
    this.bookingForm = this.fb.group({
      time: ['', Validators.required],
      branch: ['', Validators.required],
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

  onSubmit() {
    if (this.bookingForm.valid) {
      const bookingData = {
        ...this.bookingForm.value,
        type: 'pickup'
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
