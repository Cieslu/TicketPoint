import { Component } from '@angular/core';

@Component({
  selector: 'app-page-forbidden',
  standalone: true,
  imports: [],
  templateUrl: './page-forbidden.component.html',
  styleUrl: './page-forbidden.component.css'
})
export class PageForbiddenComponent {
  alert: string = "Nie masz wystarczających uprawnień, aby przejść na tę stronę!";
}
