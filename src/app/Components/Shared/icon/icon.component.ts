import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss'
})
export class IconComponent {
  @Input() iconName!: string;
  @Input() width: string = '25';
  @Input() height: string = '24';
  @Input() viewBox: string = '0 0 25 24';
  @Input() color: string = '#818181';
}
