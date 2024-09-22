import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../../services/error/error.service';
import { NgClass } from '@angular/common';


@Component({
  selector: 'app-error',
  standalone: true,
  imports: [NgClass],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent implements OnInit {
  error: number = 0;
  name: string | null = "Nie zdefiniowano";
  isVisible = false;

  constructor(
    private errorService: ErrorService
  ) { }

  ngOnInit(): void {
    this.errorService.getError().subscribe(x => {
      this.error = x;
    });

    this.name = this.errorService.getName();
  }

  hideAlert(){
    this.errorService.removeError();
  } 
}
