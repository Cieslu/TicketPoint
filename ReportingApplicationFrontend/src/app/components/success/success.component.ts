import { Component, OnInit } from '@angular/core';
import { SuccessService } from '../../services/success/success.service';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent implements OnInit {
  success: number = 0;
  name: string = "Nie zdefiniowano";
  isVisible = false;

  constructor(
    private successService: SuccessService
  ) { }

  ngOnInit(): void {
    this.successService.getSuccess().subscribe({
      next: (i_s: number) => {
        this.success = i_s;
      }
    });
    this.name = this.successService.getName();
  }

  hideAlert() {
    this.successService.removeSuccess();
  }
} 
