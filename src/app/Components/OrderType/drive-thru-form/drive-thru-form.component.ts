import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IBranch } from '../../../Models/branch';
import { BranchService } from '../../../Services/Branch/branch.service';

@Component({
  selector: 'app-drive-thru-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './drive-thru-form.component.html',
  styleUrls: ['./drive-thru-form.component.scss']
})
export class DriveThruFormComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();

  bookingForm: FormGroup;
  branches: IBranch[] = [];
  times = ['16:00', '17:00', '18:00', '19:00'];

  constructor(
    private fb: FormBuilder,
    private branchService: BranchService
  ) {
    this.bookingForm = this.fb.group({
      branch: ['', Validators.required],
      time: ['', Validators.required],
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/)]],
      carNumber: ['', Validators.required],
      carType: ['', Validators.required],
      carColor: ['', Validators.required]
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
        type: 'drive-thru'
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
