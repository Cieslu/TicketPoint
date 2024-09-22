import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ErrorComponent } from '../error/error.component';
import { IsLoggedService } from '../../services/is_logged/is-logged.service';
import { RoleService } from '../../services/role/role.service';
import { TicketFormComponent } from "../ticket-form/ticket-form.component";
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-worker-home',
  standalone: true,
  imports: [RouterLink, ErrorComponent, TicketFormComponent, ModalComponent],
  templateUrl: './worker-home.component.html',
  styleUrl: './worker-home.component.css'
})
export class WorkerHomeComponent implements OnInit {
  role$: boolean = false;
  userName: string = "";
  action: number = 0;

  constructor(
    private roleService: RoleService,
    private isLoggedService: IsLoggedService
  ) {}

  ngOnInit(): void {
    // this.roleService.getRole().subscribe({//Sprawdzanie czy użytkownik ma role "Administrator"
    //   next: (res: boolean) => {
    //     this.role$ = res;
    //   } 
    // });
    this.userName = this.isLoggedService.takeNameFromToken();
  }

  chooseOpeartion(o: number): void{
    this.action = o;
  }
}
